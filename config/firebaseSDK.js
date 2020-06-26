import firebase from "firebase";
import { Alert } from "react-native";

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: "AIzaSyDyYtgpEk64t6w63XuytDIyJvuUAMKaK8k",
        authDomain: "chatapp-6f69b.firebaseapp.com",
        databaseURL: "https://chatapp-6f69b.firebaseio.com",
        projectId: "chatapp-6f69b",
        storageBucket: "chatapp-6f69b.appspot.com",
        messagingSenderId: "862545409242",
      });
    }
  }

  /* Authentication Functions */

  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };

  createAccount = async (user) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(
        function () {
          console.log(
            "created user successfully. User email:" +
            user.email +
            " name:" +
            user.name
          );
          var userf = firebase.auth().currentUser;
          userf.updateProfile({ displayName: user.name }).then(
            function () {
              console.log(
                "Updated displayName successfully. name:" + user.name
              );
            },
            function (error) {
              console.warn("Error update displayName.");
            }
          );

          return userf;
        },
        function (error) {
          console.log(
            "got error:" + typeof error + " string:" + error.message
          );
          alert("Create account failed. Error: " + error.message);
          return false
        }
        
      );
  };

  // TODO: get Token for authentication to be sent to backend team
  getToken = () => {
    var user = firebase.auth().currentUser;

    if (user != null) {
      token = user.getIdToken();
    }
    return token;
  };

  /* User Profile Functions */

  getAccountDetails = () => {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName;
      email = user.email;
      // photoUrl = user.photoURL;
      // emailVerified = user.emailVerified;
      uid = user.uid; // The user's ID, unique to the Firebase project. For authentication, use User.getToken() instead.
    }
    var dataToSend = name + "," + email;
    console.log(dataToSend);
    return dataToSend;
    // return name, email, uid;
  };

  // TODO: update account
  updateAccount = async (newUser) => {
    var currentUser = firebase.auth().currentUser;
    if (newUser.name != currentUser.name) {
      currentUser
        .updateProfile({
          displayName: newUser.name,
          // photoURL: "https://example.com/jane-q-user/profile.jpg",
        })
        .then(function () {
          // Update successful.
          // Alert.alert("Update success");
          console.log("Name update passed");
        })
        .catch(function (error) {
          // An error happened.
          console.log("Name update failed.");
        });
    }
    if (newUser.email != currentUser.email) {
      currentUser
        .updateEmail(newUser.email)
        .then(function () {
          // Update successful.
          // Alert.alert("Update success");
          console.log("Email update passed");
        })
        .catch(function (error) {
          // An error happened.
          console.log("Email update failed.");
        });
    }
    if (newUser.password != "") {
      currentUser
        .updatePassword(newUser.password)
        .then(function () {
          // Update successful.
          console.log("Password update passed");
        })
        .catch(function (error) {
          // An error happened.
          console.log("Password update failed.");
        });
    }
    // if (newUser.newpassword != "" && newUser.oldpassword != "") {
    //   currentUser
    //     .updatePassword(newUser.newpassword)
    //     .then(function () {
    //       // Update successful.
    //       console.log("Password update passed");
    //     })
    //     .catch(function (error) {
    //       // An error happened.
    //       Alert.alert("Password update failed.");
    //     });
    // }
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        Alert.alert("You have logged out successfully.");
      })
      .catch(function (error) {
        // An error happened.
        console.log("Logout failed");
      });
  };

  // Avatar code - to be fixed

  uploadImage = async (uri, uid) => {
    console.log("got image to upload. uri:" + uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      var split = uri.split('.')
      const ext = split[split.length - 1]
      const fileName = 'avatar' + "." + ext
      var ref = firebase
        .storage()
        .ref()
        .child("images/" + uid + "/" + fileName);

      ref.put(blob)
        .on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {

          if (snapshot.state == firebase.storage.TaskState.SUCCESS) {
            console.log("success!")
          }

        }, (err) => {
          console.log(err);
          Alert.alert("Error", "Image upload errors!")
        })
    } catch (err) {
      console.log("uploadImage try/catch error: " + err.message);
    }
  };

  //   updateAvatar = (url) => {
  //     var userf = firebase.auth().currentUser;
  //     if (userf != null) {
  //       userf.updateProfile({ avatar: url }).then(
  //         function () {
  //           console.log("Updated avatar successfully. url:" + url);
  //           alert("Avatar image is saved successfully.");
  //         },
  //         function (error) {
  //           console.warn("Error update avatar.");
  //           alert("Error update avatar. Error:" + error.message);
  //         }
  //       );
  //     } else {
  //       console.log("can't update avatar, user is not login.");
  //       alert("Unable to update avatar. You must login first.");
  //     }
  //   };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get chatListRef() {
    return firebase.database().ref("messages");
  }

  chatRef = (chatId) => {
    return firebase.database().ref("messages/" + chatId)
  }

  parseChatList = (snapshot) => {
    const { key: _id } = snapshot;
    console.log(_id);

    let id1 = _id.split("_")[0];
    let id2 = _id.split("_")[1];

    if (id1 === this.uid) {
      return id2
    } else if (id2 == this.uid) {
      return id1
    } else {
      return ""
    }

  };

  getChatList = (callback) =>
    this.chatListRef
      .on("child_added", (snapshot) => callback(this.parseChatList(snapshot)));

  parseChat = (snapshot) => {
    const { isPayment } = snapshot.val();
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;

    const timestamp = new Date(numberStamp);
    const message = {
      isPayment,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  getChat = (chatId, callback) =>
    this.chatRef(chatId)
      .on("child_added", (snapshot) => callback(this.parseChat(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  sendMessage = (messages) => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = (message) => this.chatListRef.push(message);

  // close the connection to the Backend
  closeConnection() {
    this.chatListRef.off();
  }
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
