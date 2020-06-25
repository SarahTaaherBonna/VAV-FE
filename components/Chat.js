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
  };

  async componentDidMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    var username = dataObtainedFromFirebase.split(",")[0];
    // var userUID = dataObtainedFromFirebase.split(",")[2];
    this.setState({ merchantname: username });
    console.log("++++++++In Chat Page+++++++++++++");
    console.log(this.state.merchantname);
  }

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

  onPressGeneratePaymentRequest = () => {
    this.props.navigation.navigate("Payment", {
      screen: "Payment",
      merchantName: this.state.merchantname,
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
