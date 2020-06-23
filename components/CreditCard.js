import React, { Component } from "react";
import { StyleSheet, View, Button, Alert } from "react-native";
import * as firebase from "firebase";
import { CreditCardInput } from "react-native-credit-card-input";
import { TextInput } from "react-native-gesture-handler";

// TODO: send Token for authentication to backend team
// TODO: send credit card details
const s = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

export default class CreditCard extends Component {
  state = {
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  };

  _onChange = (form) => {
    /* eslint no-console: 0 */
    // console.log(JSON.stringify(formData, null, " "));
    console.log(form);
  };

  _onFocus = (field) => {
    /* eslint no-console: 0 */
    console.log(field);
  };

  // getAuthenticationToken = async () => {
  //   firebase
  //     .auth()
  //     .currentUser.getIdToken(/* forceRefresh */ true)
  //     .then(function (idToken) {
  //       // Send token to your backend via HTTPS
  //       // ...
  //       return idToken;
  //     })
  //     .catch(function (error) {});
  // };

  onPressSubmit = async () => {
    try {
      await firebaseSDK.getToken();
    } catch ({ message }) {
      console.log("Create account failed. Catch error:" + message);
    }
    // firebase
    //   .auth()
    //   .currentUser.getIdToken(/* forceRefresh */ true)
    //   .then(function (idToken) {
    //     // Send token to your backend via HTTPS
    //     // ...
    //   })
    // .catch(function (error) {});
    // submit authentication token + card details when making call (sending details) to BE team
    // this.props.navigation.navigate("Chat", {
    //   name: this.state.name,
    //   email: this.state.email,
    //   avatar: this.state.avatar,
    // });
  };

  render() {
    return (
      <View style={s.container}>
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          labelStyle={s.label}
          inputStyle={s.input}
          validColor={"black"}
          invalidColor={"red"}
          placeholderColor={"darkgray"}
          allowScroll={true}
          // onFocus={this._onFocus}
          // onChange={this._onChange}
        />
        <TextInput returnKeyType={"go"} />
        <Button
          title="Submit"
          style={styles.buttonText}
          onPress={this.onPressSubmit}
        />
      </View>
    );
  }
}
const offset = 16;
const styles = StyleSheet.create({
  buttonText: {
    marginLeft: offset,
    fontSize: 42,
  },
});
