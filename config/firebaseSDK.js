import firebase from "firebase";
import { Alert } from "react-native";
import firebaseCredentials from "./firebaseCredentials";

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: firebaseCredentials.apiKey,
        authDomain: firebaseCredentials.authDomain,
        databaseURL: firebaseCredentials.databaseURL,
        projectId: firebaseCredentials.projectId,
        storageBucket: firebaseCredentials.storageBucket,
        messagingSenderId: firebaseCredentials.messagingSenderId,
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

  loginWithoutCallback = async (email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
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

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get displayName() {
    return (firebase.auth().currentUser || {}).displayName;
  }

  get email() {
    return (firebase.auth().currentUser || {}).email;
  }

  // prerequisite: must check if name is different before calling
  updateName = async (name) => {
    let currentUser = firebase.auth().currentUser;
    await currentUser
      .updateProfile({
        displayName: name,
      })
      .then(() => {
        console.log("Name update succeeded.");
      });
  };

  // prerequisite: must check if email is different before calling
  updateEmail = async (email) => {
    var currentUser = firebase.auth().currentUser;
    await currentUser.updateEmail(email).then(() => {
      console.log("Email update succeeded.");
    });
  };

  updatePassword = async (password) => {
    var currentUser = firebase.auth().currentUser;
    await currentUser.updatePassword(password).then(() => {
      console.log("Password update succeeded.");
    });
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
          let merchantname = this.displayName;
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

  updateDatabaseName = async (uid, name) => {
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
