import React from "react";
import { Platform, KeyboardAvoidingView, SafeAreaView } from "react-native";
// @flow
import { GiftedChat } from "react-native-gifted-chat";
import firebaseSDK from "../config/firebaseSDK";

// export default class Chat extends React.Component {
//   render() {
//     return <GiftedChat />;
//   }
// }

type Props = {
  name?: string,
};

export default class Chat extends React.Component<Props> {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || "Chat!",
  });

  state = {
    messages: [],
  };

  get user() {
    return {
      name: this.props.route.params.name,
      email: this.props.route.params.email,
      avatar: this.props.route.params.avatar,
      id: firebaseSDK.uid,
      _id: firebaseSDK.uid,
    };
  }

  render() {
    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSDK.sendMessage}
        user={this.user}
      />
    );

    return <SafeAreaView style={{ flex: 1 }}>{chat}</SafeAreaView>;
  }

  componentDidMount() {
    firebaseSDK.getMessages((message) =>
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    firebaseSDK.closeConnection();
  }
}
