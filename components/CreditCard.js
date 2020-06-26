import React, { Component } from "react";
import { StyleSheet, View, Button, Alert, Keyboard } from "react-native";
import axios from "axios";
import * as firebase from "firebase";
import firebaseSDK from "../config/firebaseSDK";
import { CreditCardInput } from "react-native-credit-card-input";
import { TextInput } from "react-native-gesture-handler";
import FlatButton from "../components/Button";

const s = StyleSheet.create({
  container: {
    height:667,
    backgroundColor: "#16267D",
    paddingTop:60,
  },
  label: {
    color: "#FFFFFF",
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
    useremail: "",
    useruid: "",
  };

  async componentDidMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    var userEmail = dataObtainedFromFirebase.split(",")[1];
    var userUID = dataObtainedFromFirebase.split(",")[2];
    this.setState({ useremail: userEmail });
    this.setState({ useruid: userUID });
  }

  _onChange = (form) => {
    /* eslint no-console: 0 */
    // console.log(form);
    if (form.valid == true) {
      this.state.cardName = form.values.name;
      var usercardNumber = form.values.number.replace(/\s/g, "");
      this.state.cardNumber = usercardNumber;
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
      var data = {
        email: this.state.useremail,
        card_number: this.state.cardNumber,
        full_name: this.state.cardName,
        expiry_date: this.state.expiryDate,
        ccv: this.state.cardcvc,
        uid: this.state.useruid,
      };
      firebase
        .auth()
        .currentUser.getIdToken(/* forceRefresh */ true)
        .then(function (idToken) {
          console.log(
            "------------IN CREDIT CARD PAGE ON SUBMIT-----------------"
          );
          console.log("DATA: " + Object.values(data));
          axios
            .post("https://khanhphungntu.ml/save_card/", data, {
              headers: { Authorization: idToken },
            })
            .then((res) => {
              console.log("==========Response===============");
              console.log(res.data);
            });
        })
        .catch(function (error) {
          // Handle error
          console.log("*************ERROR***********");
          console.log(error);
        });
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
          placeholderColor={"gray"}
          allowScroll={true}
          // onFocus={this._onFocus}
          onChange={this._onChange}
        />

        <View style={{marginTop:25}}>
        <FlatButton text="SUBMIT" onPress={this.onPressSubmit.bind(this) } />
        </View>

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
