import React, { Component } from "react";
import { StyleSheet, View, Button, Alert, Text } from "react-native";
import { Avatar, Header } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebaseSDK from "../config/firebaseSDK";

// TODO: create ChatList for user

export default class ChatList extends Component {
  state = {
    chatListings: [],
  };

  generateChatListing = (id, name, avatar) => {

    const newChatListing = (
      <View
      style={{
        flexDirection: "row",
        height: 90,
        padding: 20,
        borderBottomWidth: 1,
        // onPress: {onPressListing(id, name, avatar)},
      }}>
        <TouchableOpacity
        onPress={() => {this.onPressListing(id, name, avatar)}}
        >
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
            <Text style={styles.Text}>Message</Text>
          </View>
        </TouchableOpacity>
      </View>

      
    )

    return newChatListing

  }

  onPressListing = (id, name, avatar) => {
    console.log("pressed")
    this.props.navigation.navigate("Chat", {
      id: id,
      name: name,
      avatar: avatar,
    });
  }

  render() {
    return this.state.chatListings;
  }

  componentDidMount() {
    firebaseSDK.getChatList((id) => {
      let newChatListing = this.generateChatListing(id, "name", "avatar")
      this.setState((previousState) => ({
        chatListings: [...previousState.chatListings, newChatListing],
      }))
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
});
