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

  createAccount = async (user, callback) => {
    firebase
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
        },
        function (error) {
          console.error(
            "got error:" + typeof error + " string:" + error.message
          );
          alert("Create account failed. Error: " + error.message);
        }
      )
      .then(callback);
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
    var dataToSend = name + "," + email + "," + uid;
    console.log(dataToSend);
    return dataToSend;
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

  //   uploadImage = async (uri, imageName) => {
  //     const response = await fetch(uri);
  //     const blob = await response.blob();

  //     var ref = firebase
  //       .storage()
  //       .ref()
  //       .child("images/" + imageName);
  //     return ref.put(blob);
  //   };
  //   uploadImage = async (uri) => {
  //     console.log("got image to upload. uri:" + uri);
  //     try {
  //       const response = await fetch(uri);
  //       const blob = await response.blob();
  //       //   const ref = firebase.storage().ref("avatar").child(uuid.v4());
  //       var ref = firebase
  //         .storage()
  //         .ref()
  //         .child("images/" + imageName);
  //       return ref.put(blob);
  //     } catch (err) {
  //       console.log("uploadImage try/catch error: " + err.message);
  //     }
  //   };

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
    return firebase.database().ref("chats");
  }

  get userInfoRef() {
    return firebase.database().ref("users");
  }

  getNameFromUid = (uid) => {
    this.userInfoRef.once("value", (data) => {
      let name = data.val()[uid];
      // callback(name);
      return name;
    });
  };

  parseChatList = (snapshot, callback) => {
    const { key: _id } = snapshot;

    let myId = _id.split("_")[0];
    let otherId = _id.split("_")[1];

    if (myId !== this.uid && otherId !== this.uid) {
      return;
    }

    if (myId !== this.uid) {
      let temp = otherId;
      otherId = myId;
      myId = temp;
    }

    let ref = this.chatRef(_id);

    ref
      .orderByChild("timestamp")
      .limitToLast(1)
      .once("value", (data) => {
        const key = Object.keys(data.val())[0];
        const { text } = data.val()[key];

        this.getNameFromUid(otherId, (name) => {
          callback(_id, name, text);
        });
      });
  };

  getChatList = (callback) =>
    this.chatListRef.on("child_added", (snapshot) => {
      this.parseChatList(snapshot, callback);
    });

  chatRef = (chatId) => {
    return firebase.database().ref("chats/" + chatId);
  };

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

  getChat = (chatKey, callback) => {
    this.chatRef(chatKey)
      .orderByChild("timestamp")
      .on("child_added", (snapshot) => {
        callback(this.parseChat(snapshot));
      });
  };

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  getSendMessageRef = (chatKey) => {
    let sendMessage = (messages) => {
      for (let i = 0; i < messages.length; i++) {
        const { text, user } = messages[i];
        const message = {
          text,
          user,
          timestamp: this.timestamp,
        };
        console.log(message);
        this.chatRef(chatKey).push(message);
        // this.append(message);
      }
    };

    return sendMessage;
  };

  // close the connection to the Backend
  closeConnection() {
    this.chatListRef.off();
  }
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
