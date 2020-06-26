import React from "react";
import {
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
} from "react-native";
import { Header, Button } from "react-native-elements";
// @flow
import { GiftedChat } from "react-native-gifted-chat";
import firebaseSDK from "../config/firebaseSDK";

export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Chat!",
  });

  async UNSAFE_componentWillMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    console.log(dataObtainedFromFirebase);
    var userUID = dataObtainedFromFirebase.split(",")[2];
    var username = dataObtainedFromFirebase.split(",")[0];
    this.setState({ merchantname: username });
    // console.log("++++++++In Chat Page+++++++++++++");
    // console.log("Merchant Name: " + this.state.merchantname);
    var user1 = this.chatKey.split("_")[0];
    var user2 = this.chatKey.split("_")[1];
    if (userUID == user1) {
      var buyerUID = user2;
    } else {
      var buyerUID = user1;
    }

    await firebaseSDK.getNameFromUid(buyerUID, (name) => {
      this.setState({ buyername: name });
      // console.log("Buyer Name: " + this.state.buyername);
    });

    if (this.state.productprice != "" && this.state.productname != "") {
      this.setState({ productname: productname });
      this.setState({ productprice: productprice });
    }

    console.log(this.state);
  }

  state = {
    messages: [],
    merchantname: "",
    buyername: "",
    productname: "",
    productprice: "",
  };

  getCurrentUserDetails() {
    const userDetails = firebaseSDK.getAccountDetails();

    let name = userDetails.split(",")[0];
    let email = userDetails.split(",")[1];
    let id = userDetails.split(",")[2];

    return {
      name: name,
      email: email,
      avatar: "",
      id: id,
      _id: id,
    };
  }

  get chatKey() {
    return this.props.route.params.chatKey;
  }

  // callback function
  onReceivePaymentDetails = (
    merchantname,
    buyername,
    productname,
    productprice
  ) => {
    this.setState({ merchantname: merchantname });
    this.setState({ buyername: buyername });
    this.setState({ productname: productname });
    this.setState({ productprice: productprice });
  };

  onPressGeneratePaymentRequest = () => {
    this.props.navigation.navigate("Payment", {
      screen: "Payment",
      merchantname: this.state.merchantname,
      buyername: this.state.buyername,
      chatKey: this.chatKey,
      callback: this.onReceivePaymentDetails,
    });
  };

  render() {
    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSDK.getSendMessageRef(this.chatKey)}
        user={this.getCurrentUserDetails()}
        wrapperStyle={{
          right: {
            backgroundColor: "#16267D",
          },
          left: {
            backgroundColor: "#F7B600",
          },
        }}
        textStyle={{
          right: {
            Color: "#F7B600",
          },
          left: {
            Color: "#16267D",
          },
        }}
      />
    );
    return (
      <View style={{ flex: 1 }}>
        <Button
          title="Generate Payment Request"
          onPress={this.onPressGeneratePaymentRequest}
        />
        <View style={{ flex: 1 }}>{chat}</View>
      </View>
    );
  }

  componentDidMount() {
    firebaseSDK.getChat(this.chatKey, (message) =>
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    firebaseSDK.closeConnection();
  }
}
