import React, { Component } from "react";
import { StyleSheet, View, Button, Alert, Keyboard, TouchableOpacity } from "react-native";
import axios from "axios";
import * as firebase from "firebase";
import firebaseSDK from "../config/firebaseSDK";
import { CreditCardInput, CardView } from "react-native-credit-card-input";
import { TextInput } from "react-native-gesture-handler";

const s = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  cardView:{
    backgroundColor: "#F5F5F5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
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
    useremail: "",
    useruid: "",
    isLoaded: false,
    cardView: "front",
  };

  async componentDidMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    var userEmail = dataObtainedFromFirebase.split(",")[1];
    var userUID = dataObtainedFromFirebase.split(",")[2];
    const navigation = this.props.route.params;
    const isStart = navigation.isStart

    if (!isStart) {
      // set the credit card details
      const idToken = await firebase
        .auth()
        .currentUser.getIdToken(true);

      const response = await axios.get("https://khanhphungntu.ml/view_card/" + userUID, {
        headers: { Authorization: idToken },
      });

      this.setState({ cardName: response.data.card_details.full_name });
      this.setState({ cardNumber: response.data.card_details.card_number });
      this.setState({ expiryDate: response.data.card_details.expiry_date });
      this.setState({ cardcvc: response.data.card_details.ccv });
    }
    this.setState({ useremail: userEmail });
    this.setState({ useruid: userUID });
    this.setState({ isLoaded: true })
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

  toggleCardView = () =>{
    if(this.state.cardView === "front"){
      this.setState({cardView : "cvc"})
    }
    else{
      this.setState({cardView: "front"})
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return <></>
    }

    if (!this.props.isStart) {
      return (
        <View style={s.cardView}>
          <TouchableOpacity onPress={this.toggleCardView}>
          <CardView brand="visa"
            focused={this.state.cardView}
            name={this.state.cardName}
            number={this.state.cardNumber}
            expiry={this.state.expiryDate}
            cvc={this.state.cardcvc} />
          </TouchableOpacity>
        </View>
      )
    }

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
        <Button
          title="Submit"
          style={styles.buttonText}
          // onPress={this.onPressSubmit}
          onPress={this.onPressSubmit.bind(this)}
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
