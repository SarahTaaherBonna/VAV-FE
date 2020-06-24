import React, { Component } from "react";
import { StyleSheet, View, Button, Alert, Text } from "react-native";
import { Avatar, Header } from "react-native-elements";

// TODO: create ChatList for user

export default class ChatList extends Component {
  state = {
    name: "",
    email: "",
    avatar: "",
  };

  render() {
    return (
      <>
        {/* <Header
          statusBarProps={{ translucent: true }}
          centerComponent={{ text: "Chats", style: { color: "#fff" } }}
        /> */}
        <View
          style={{
            flexDirection: "row",
            height: 90,
            padding: 20,
            borderBottomWidth: 1,
          }}
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
          <Text style={styles.titleText}>Diane Tucker</Text>
        </View>
      </>
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
