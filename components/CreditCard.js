import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import axios from "axios";
import * as firebase from "firebase";
import firebaseSDK from "../config/firebaseSDK";
import { CreditCardInput, CardView } from "react-native-credit-card-input";
import FlatButton from "../components/Button";
import Loader from '../components/Loader';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const resizeWidth = (w) => {
  return (value = w * (windowWidth / 375));
};

const resizeHeight = (h) => {
  return (value = h * (windowHeight / 872));
};

const s = StyleSheet.create({
  container: {
    height: resizeHeight(667),
    backgroundColor: "#16267D",
    paddingTop: resizeHeight(60),
  },
  cardView: {
    backgroundColor: "#16267D",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  padding: {
    height: resizeHeight(50),
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "white",
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
    loading: false
  };

  async componentDidMount() {
    this.setState({loading: true})

    var userEmail = firebaseSDK.email
    var userUID = firebaseSDK.uid
    const navigation = this.props.route.params;
    const isStart = navigation.isStart;

    if (!isStart) {
      // set the credit card details
      const idToken = await firebase.auth().currentUser.getIdToken(true);

      try {
        const response = await axios.get(
          "https://khanhphungntu.ml/view_card/" + userUID,
          {
            headers: { Authorization: idToken },
          }
        );
        this.setState({ cardName: response.data.card_details.full_name });
        this.setState({ cardNumber: response.data.card_details.card_number });
        this.setState({ expiryDate: response.data.card_details.expiry_date });
        this.setState({ cardcvc: response.data.card_details.ccv });
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({ useremail: userEmail });
    this.setState({ useruid: userUID, loading: false });
  }

  _onChange = (form) => {
    /* eslint no-console: 0 */
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
  };

  onPressSubmit = async () => {
    try {
      this.setState({loading: true})
      var data = {
        email: this.state.useremail,
        card_number: this.state.cardNumber,
        full_name: this.state.cardName,
        expiry_date: this.state.expiryDate,
        ccv: this.state.cardcvc,
        uid: this.state.useruid,
      };
      const idToken = await firebase.auth().currentUser.getIdToken(true);
      try {
        const response = await axios.post(
          "https://khanhphungntu.ml/save_card/",
          data,
          {
            headers: { Authorization: idToken },
          }
        );
      } catch (error) {
        console.log("*************ERROR***********");
        console.log(error);
      }

      this.setState({loading: false})
      this.props.navigation.navigate("Home", {
        screen: "ProductListing",
      });
      Keyboard.dismiss();
      if (!this.props.isStart) {
        this.forceUpdate();
      }
    } catch ({ message }) {
      console.log("Create account failed. Catch error:" + message);
      this.setState({loading: false})
    }
  };

  toggleCardView = () => {
    if (this.state.cardView === "front") {
      this.setState({ cardView: "cvc" });
    } else {
      this.setState({ cardView: "front" });
    }
  };

  renderActivityIndicator = () => {
    if (!this.state.isLoaded) {
      return <ActivityIndicator size="large" color="#F7B600" />;
    }
    return <View style={s.padding} />;
  };

  render() {
    if (this.state.loading) {
      return <Loader />
    }

    if (!this.props.isStart && this.state.cardNumber !== "") {
      return (
        <View style={s.cardView}>
          <TouchableOpacity onPress={this.toggleCardView}>
            <CardView
              brand="visa"
              focused={this.state.cardView}
              name={this.state.cardName}
              number={this.state.cardNumber}
              expiry={this.state.expiryDate}
              cvc={this.state.cardcvc}
            />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={s.container}>
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          labelStyle={s.label}
          inputStyle={s.input}
          validColor={"white"}
          invalidColor={"red"}
          placeholderColor={"gray"}
          allowScroll={true}
          // onFocus={this._onFocus}
          onChange={this._onChange}
        />
        <View style={{ marginTop: 25 }}>
          <FlatButton text="SUBMIT" onPress={this.onPressSubmit.bind(this)} />
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
