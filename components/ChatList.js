import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Alert,
  Text,
  SafeAreaView,
  ScrollView,
  FlatView,
} from "react-native";
import { Avatar, Header } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebaseSDK from "../config/firebaseSDK";

// TODO: create ChatList for user

export default class ChatList extends Component {
  state = {
    chatListings: [],
  };

  generateChatListing = (chatKey, name, text) => {
    const newChatListing = (
      <TouchableOpacity
        onPress={() => {
          this.onPressListing(chatKey);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: 90,
            width: 340,
            padding: 10,
            backgroundColor: "#16267D",
            borderRadius: 15,
            borderBottomLeftRadius: 100,
            borderTopLeftRadius: 100,
            margin: 15,
          }}
        >
          <Avatar
            size="large"
            rounded
            source={{
              uri:
                "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
            }}
            containerStyle={{ backgroundColor: "#F7B600", padding: 5 }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              padding: 10,
            }}
          >
            <Text style={styles.titleText}>{name}</Text>
            <Text style={styles.messageText}>{text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
    return newChatListing;
  };

  onPressListing = (chatKey) => {
    this.props.navigation.navigate("Chat", {
      chatKey: chatKey,
      merchantname: "",
      buyername: "",
      productname: "",
      productprice: "",
    });
  };

  render() {
    return this.state.chatListings;
  }

  componentDidMount() {
    firebaseSDK.getChatList((chatKey, name, text) => {
      let newChatListing = this.generateChatListing(chatKey, name, text);
      this.setState((previousState) => ({
        chatListings: [...previousState.chatListings, newChatListing],
      }));
    });
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 15,
    color: "white",
  },
  messageText: {
    fontSize: 14,
    paddingLeft: 15,
    color: "white",
    marginTop: 5,
  },

  contentContainer: {
    paddingVertical: 20,
  },
});
