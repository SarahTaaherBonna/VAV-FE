import React from "react";
import { Platform, KeyboardAvoidingView, SafeAreaView, View} from "react-native";
// @flow
import { GiftedChat } from "react-native-gifted-chat";
import firebaseSDK from "../config/firebaseSDK";


export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Chat!",
  });

  state = {
    messages: [],
  };

  getUserDetails() {
    const userDetails = firebaseSDK.getAccountDetails();

    let name = userDetails.split(',')[0]
    let email = userDetails.split(',')[1]
    let id = userDetails.split(',')[2]

    return {
      name: name,
      email: email,
      avatar: "",
      id: id,
      _id: id,
    }
  }

  get chatKey() {
    return this.props.route.params.chatKey;
  }

  render() {
    const chat = (

      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSDK.getSendMessageRef(this.chatKey)}
        user={this.getUserDetails()}
        wrapperStyle={{
          right: {
          backgroundColor: '#16267D'},
          left: {
          backgroundColor:'#F7B600'}
        }}
        textStyle={{
          right: {
          Color: '#F7B600'},
          left: {
          Color:'#16267D'}
        }}
      />
      
    );

    return <SafeAreaView style={{flex: 1 }}>{chat}</SafeAreaView>;
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
