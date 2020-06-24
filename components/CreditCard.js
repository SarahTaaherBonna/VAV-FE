import React, { Component } from "react";
import { StyleSheet, View, Button, Alert, Keyboard } from "react-native";
import * as firebase from "firebase";
import firebaseSDK from "../config/firebaseSDK";
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
    cardcvc: "",
  };

  _onChange = (form) => {
    /* eslint no-console: 0 */
    // console.log(form);
    if (form.valid == true) {
      this.state.cardName = form.values.name;
      this.state.cardNumber = form.values.number;
      this.state.cardcvc = form.values.cvc;
      this.state.expiryDate = form.values.expiry;
    }
  };

  _onFocus = (field) => {
    /* eslint no-console: 0 */
    console.log(field);
  };

  onPressSubmit = async () => {
    try {
      const tokenObject = firebaseSDK.getToken();
      // console.log(Object.values(token));
      // console.log(typeof token);
      var token = Object.values(tokenObject);
      var dataToSend =
        this.state.cardName +
        "," +
        this.state.cardNumber +
        "," +
        this.state.cardcvc +
        "," +
        this.state.expiryDate;

      console.log(token);
      console.log(dataToSend);
      this.props.navigation.navigate("Home", {
        screen: "ProductListing",
      });
      Keyboard.dismiss();
    } catch ({ message }) {
      console.log("Create account failed. Catch error:" + message);
    }
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
          onChange={this._onChange}
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
