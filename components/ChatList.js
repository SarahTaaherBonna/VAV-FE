import React, { Component } from "react";
import { StyleSheet, View, Button, Alert, Text, SafeAreaView, ScrollView, FlatView} from "react-native";
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
      onPress={() => {this.onPressListing(chatKey)}}
      >
        <View
        style={{
          flexDirection: "row",
          height: 90,
          padding: 20,
          borderBottomWidth: 1,
        }}>

            {/* <View style={{ backgroundColor: "blue", flex: 0.3 }} />
            <View style={{ backgroundColor: "white", flex: 0.5 }} /> */}
            {/* Standard Avatar */}
            <Avatar
              rounded
              source={{
                uri:
                  "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
              }}
            />
            <View
            style={{
              flex: 1,
              flexDirection: 'column',
            }}>
              <Text style={styles.titleText}>{name}</Text>
              <Text style={styles.Text}>{text}</Text>
            </View>
        </View>
      </TouchableOpacity>
    )
    return newChatListing
  }

  onPressListing = (chatKey) => {
    this.props.navigation.navigate("Chat", {
      chatKey: chatKey
    });
  }

  render() {
    return this.state.chatListings;
  }

  componentDidMount() {
    firebaseSDK.getChatList((chatKey, name, text) => {

      let newChatListing = this.generateChatListing(chatKey, name, text);
      this.setState((previousState) => ({
        chatListings: [...previousState.chatListings, newChatListing],
      }));
    }
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 15,
  },

  contentContainer: {
    paddingVertical: 20
  }
});
