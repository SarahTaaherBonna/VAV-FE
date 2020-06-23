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

  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };

  createAccount = async (user) => {
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
              alert(
                "User " + user.name + " was created successfully. Please login."
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
      );
  };

  getAccountDetails = async (user) => {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName;
      email = user.email;
      // photoUrl = user.photoURL;
      // emailVerified = user.emailVerified;
      uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }
    return name, email, uid;
  };

  // TODO: get Token for authentication to be sent to backend team
  getToken = () => {
    var user = firebase.auth().currentUser;

    if (user != null) {
      token = user.getIdToken();
    }
    return token;
  };

  // TODO: update account
  updateAccount = async (newUser) => {
    var currentUser = firebase.auth().currentUser;
    currentUser
      .updateProfile({
        displayName: newUser.name,
        // photoURL: "https://example.com/jane-q-user/profile.jpg",
      })
      .then(function () {
        // Update successful.
        Alert.alert("Update success");
      })
      .catch(function (error) {
        // An error happened.
        Alert.alert("Update failed.");
      });
    currentUser
      .updateEmail(newUser.email)
      .then(function () {
        // Update successful.
        Alert.alert("Update success");
      })
      .catch(function (error) {
        // An error happened.
        Alert.alert("Update failed.");
      });
  };

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

  get ref() {
    return firebase.database().ref("messages");
  }

  parse = (snapshot) => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = (callback) =>
    this.ref
      .limitToLast(20)
      .on("child_added", (snapshot) => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = (messages) => {
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

  append = (message) => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;

// class FirebaseSDK {
//   constructor() {
//     if (!firebase.apps.length) {
//       //avoid re-initializing
//       firebase.initializeApp({
//         apiKey: "AIzaSyDyYtgpEk64t6w63XuytDIyJvuUAMKaK8k",
//         authDomain: "chatapp-6f69b.firebaseapp.com",
//         databaseURL: "https://chatapp-6f69b.firebaseio.com",
//         projectId: "chatapp-6f69b",
//         storageBucket: "chatapp-6f69b.appspot.com",
//         messagingSenderId: "862545409242",
//       });
//     }
//   }

//   login = async (user, success_callback, failed_callback) => {
//     await firebase
//       .auth()
//       .signInWithEmailAndPassword(user.email, user.password)
//       .then(success_callback, failed_callback);
//   };

//   createAccount = async (user) => {
//     firebase
//       .auth()
//       .createUserWithEmailAndPassword(user.email, user.password)
//       .then(
//         function () {
//           console.log(
//             "created user successfully. User email:" +
//               user.email +
//               " name:" +
//               user.name
//           );
//           var userf = firebase.auth().currentUser;
//           userf.updateProfile({ displayName: user.name }).then(
//             function () {
//               console.log(
//                 "Updated displayName successfully. name:" + user.name
//               );
//               alert(
//                 "User " + user.name + " was created successfully. Please login."
//               );
//             },
//             function (error) {
//               console.warn("Error update displayName.");
//             }
//           );
//         },
//         function (error) {
//           console.error(
//             "got error:" + typeof error + " string:" + error.message
//           );
//           alert("Create account failed. Error: " + error.message);
//         }
//       );
//   };

//   // HAS ERRORS
//   //   uploadImage = async uri => {
//   //     console.log('got image to upload. uri:' + uri);
//   //     try {
//   //       const response = await fetch(uri);
//   //       const blob = await response.blob();
//   //       const ref = firebase
//   //         .storage()
//   //         .ref('avatar')
//   //         .child(uuid.v4());
//   //       const task = ref.put(blob);

//   //       return new Promise((resolve, reject) => {
//   //         task.on(
//   //           'state_changed',
//   //           () => {

//   //           },
//   //           reject
//   //           () => resolve(task.snapshot.downloadURL)
//   //         );
//   //       });
//   //     } catch (err) {
//   //       console.log('uploadImage try/catch error: ' + err.message);
//   //     }
//   //   };

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
// }
// const firebaseSDK = new FirebaseSDK();
// export default firebaseSDK;
