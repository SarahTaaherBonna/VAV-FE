import React, { Component } from "react";
import { StyleSheet, View, Button, Alert, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";

// TODO: create ChatList for user
const s = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

export default class ChatList extends Component {
  state = {
    name: "",
    email: "",
    avatar: "",
  };

  render() {
    return <View style={s.container}></View>;
  }
}
// const offset = 16;
// const styles = StyleSheet.create({
//   buttonText: {
//     marginLeft: offset,
//     fontSize: 42,
//   },
// });
