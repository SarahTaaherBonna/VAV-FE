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
          alert("Create account failed. Error: " + error.message);
          return false;
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
      // The user's ID, unique to the Firebase project. For authentication, use User.getToken() instead.
      uid = user.uid;
    }
    var dataToSend = name + "," + email + "," + uid;
    return dataToSend;
  };

  getCurrentUserDisplayName = () => {
    var user = firebase.auth().currentUser;

    if (user != null) {
      return user.displayName;
    }
  };

  updateUserName = async (newUser) => {
    var currentUser = firebase.auth().currentUser;
    if (newUser.name != currentUser.name) {
      await currentUser
        .updateProfile({
          displayName: newUser.name,
        })
        .catch(function (error) {
          // An error happened.
          console.log("Name update failed.");
        });
    }
  };

  updateEmail = async (newUser) => {
    var currentUser = firebase.auth().currentUser;
    if (newUser.email != currentUser.email) {
      await currentUser
        .updateEmail(newUser.email)
        .then(function () {
          // Update successful.
          // Alert.alert("Update success");
          this.logout;
          this.props.navigation.navigate("Login", {
            screen: "Login",
          });
        })
        .catch(function (error) {
          // An error happened.
          console.log("Email update failed.");
          console.log(error);
        });
    }
  };

  updatePassword = async (newUser) => {
    var currentUser = firebase.auth().currentUser;
    if (newUser.password != currentUser.password) {
      await currentUser
        .updatePassword(newUser.password)
        .then(function () {
          // Update successful.
          this.logout;
          this.props.navigation.navigate("Login", {
            screen: "Login",
          });
        })
        .catch(function (error) {
          // An error happened.
          console.log("Password update failed.");
          console.log(error);
        });
      await firebase
        .auth()
        .signInWithEmailAndPassword(currentUser.email, currentUser.password);
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

  uploadImage = async (uri, uid) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      var split = uri.split(".");
      const ext = split[split.length - 1];
      const fileName = "avatar" + "." + ext;
      var ref = firebase
        .storage()
        .ref()
        .child("images/" + uid + "/" + fileName);

      ref.put(blob).on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          if (snapshot.state == firebase.storage.TaskState.SUCCESS) {
            Alert.alert("Success", "Image updated successfully");
          }
        },
        (err) => {
          Alert.alert("Error", "Could not update image");
        }
      );
    } catch (err) {
      console.log("uploadImage try/catch error: " + err.message);
    }
  };

  getCurrentUserUid = () => {
    var user = firebase.auth().currentUser;

    if (user != null) {
      return user.uid;
    }
  };

  getAvatar = async () => {
    try {
      let uid = firebase.auth().currentUser.uid;
      var storage = firebase.storage();
      var pathReference = storage.ref("images/" + uid);
      var listRef = await pathReference.listAll();
      var img = null;
      listRef.items.forEach((item) => {
        let split = item.name.split(".");
        if (split[0] == "avatar") {
          img = item.name;
          return;
        }
      });

      if (img) {
        return await pathReference.child(img).getDownloadURL();
      }
    } catch (err) {
      console.log("uploadImage try/catch error: " + err.message);
      return null;
    }
  };

  getChatAvatar = async (uid) => {
    try {
      var storage = firebase.storage();
      var pathReference = storage.ref("images/" + uid);
      var listRef = await pathReference.listAll();
      var img = null;
      listRef.items.forEach((item) => {
        let split = item.name.split(".");
        if (split[0] == "avatar") {
          img = item.name;
          return;
        }
      });

      if (img) {
        return await pathReference.child(img).getDownloadURL();
      }
    } catch (err) {
      console.log("uploadImage try/catch error: " + err.message);
      return null;
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get chatRef() {
    return firebase.database().ref("chats");
  }

  get userInfoRef() {
    return firebase.database().ref("users");
  }

  getNameFromUid = (uid, callback) => {
    this.userInfoRef.once("value", (data) => {
      let name = data.val()[uid];
      callback(name);
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

    this.chatRef
      .child(_id)
      .orderByChild("timestamp")
      .limitToLast(1)
      .once("value", (data) => {
        const key = Object.keys(data.val())[0];
        const { text } = data.val()[key];

        this.getNameFromUid(otherId, (buyername) => {
          let merchantname = this.getCurrentUserDisplayName();
          callback(_id, merchantname, buyername, myId, otherId, text);
        });
      });
  };

  getChatList = (callback) =>
    this.chatRef.on("child_added", (snapshot) => {
      this.parseChatList(snapshot, callback);
    });

  parseChat = (snapshot) => {
    const { isPayment } = snapshot.val();
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;

    let isPaid = false;
    let isTimeout = false;

    if (isPayment) {
      isPaid = snapshot.val().isPaid;
      isTimeout = snapshot.val().isTimeout;
    }

    const timestamp = new Date(numberStamp);
    const message = {
      isTimeout,
      isPaid,
      isPayment,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  getChat = (chatKey, callback) => {
    this.chatRef
      .child(chatKey)
      .orderByChild("timestamp")
      .on("child_added", (snapshot) => {
        callback(this.parseChat(snapshot));
      });
  };

  getChatOnce = async (chatKey) => {
    let messages = [];

    const ref = await firebase.database().ref("chats").child(chatKey);

    const snapshot = await ref.orderByChild("timestamp").once("value");

    return this.parseObjectsChat(snapshot.val());
  };

  parseObjectsChat = (snapshots) => {
    let message;
    let messages = [];
    let isPaid = false;
    let isTimeout = false;

    for (const key in snapshots) {
      const isPayment = snapshots[key]["isPayment"];
      const numberStamp = snapshots[key]["timestamp"];

      const timestamp = new Date(numberStamp);
      const _id = key;
      const text = snapshots[key]["text"];
      const user = snapshots[key]["user"];
      if (snapshots[key].isPayment) {
        isPaid = snapshots[key]["isPaid"];
        isTimeout = snapshots[key]["isTimeout"];
      }

      message = {
        isTimeout,
        isPaid,
        isPayment,
        _id,
        timestamp,
        text,
        user,
      };
      messages = [...messages, message];
    }

    return messages;
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
          isPayment: false,
          isPaid: false,
          isTimeout: false,
        };
        this.chatRef.child(chatKey).push(message);
        // this.append(message);
      }
    };
    return sendMessage;
  };

  sendReceiptMessage = (chatKey, incomingMessage) => {
    const { text, user } = incomingMessage;
    const message = {
      text,
      user,
      timestamp: this.timestamp,
      isPayment: true,
      isPaid: true,
      isTimeout: false,
    };
    this.chatRef.child(chatKey).push(message);
  };

  sendPaymentMessage = (chatKey, incomingMessage) => {
    const { text, user } = incomingMessage;
    const message = {
      text,
      user,
      timestamp: this.timestamp,
      isPayment: true,
      isPaid: false,
      isTimeout: false,
    };
    this.chatRef.child(chatKey).push(message);
  };

  markIsPaid = (chatKey, messageKey) => {
    this.chatRef.child(chatKey).child(messageKey).update({
      isPaid: true,
    });
  };

  markIsTimeout = (chatKey, messageKey) => {
    this.chatRef.child(chatKey).child(messageKey).update({
      isTimeout: true,
    });
  };

  updateName = async (uid, name) => {
    let ref = this.userInfoRef;
    let obj = {};
    obj[uid] = name;
    ref.update(obj);
  };

  closeChatListConnection() {
    this.chatRef.off();
  }

  // close the connection to the Backend
  closeChatConnection() {
    this.chatRef.off();
  }
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
