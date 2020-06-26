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

  state = {
    messages: [],
    merchantname: "",
    buyername: "",
  };

  async componentDidMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    var userUID = dataObtainedFromFirebase.split(",")[2];
    var username = dataObtainedFromFirebase.split(",")[0];
    var user1 = this.chatKey.split("_")[0];
    var user2 = this.chatKey.split("_")[1];
    if (userUID == user1) {
      var buyerUID = user2;
    } else {
      var buyerUID = user1;
    }

    const response = await firebaseSDK.getNameFromUid(
      buyerUID,
      this.getBuyername
    );

    this.setState({ merchantname: username });
    this.setState({ buyername: response });
    console.log("++++++++In Chat Page+++++++++++++");
    console.log(this.state.merchantname);
    console.log(this.state.buyername);
  }

  getBuyername = () => {};

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

  get productName() {
    return this.props.route.params.productName;
  }

  get productPrice() {
    return this.props.route.params.productPrice;
  }

  onPressGeneratePaymentRequest = () => {
    this.props.navigation.navigate("Payment", {
      screen: "Payment",
      merchantname: this.state.merchantname,
      buyername: this.state.buyername,
      chatKey: this.chatKey,
    });
  };

  render() {
    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSDK.getSendMessageRef(this.chatKey)}
        user={this.getCurrentUserDetails()}
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
    return <SafeAreaView style={{ flex: 1 }}>{chat}</SafeAreaView>;
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
