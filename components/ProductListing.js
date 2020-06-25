import React, { Component } from "react";
import { StyleSheet, View, Alert, Text, Image } from "react-native";
import { Card, ListItem, Button, Icon, Header } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ChatList from "./ChatList";
import ProfilePage from "./ProfilePage";

export default class ProductListing extends Component {
  state = {
    productName: "",
    productPrice: "",
    productDescription: "",
    productImage: "",
  };

  render() {
    return (
      <>
        <Card
          image={require("../assets/Camera.png")}
          containerStyle={{
            width: 160,
            height: 230,
            paddingRight: 10,
          }}
        >
          <Text style={styles.titleText}>Blue-Yellow Camera</Text>
          <Text style={styles.price}>$10</Text>
        </Card>
      </>
    );
  }
}

var styles = StyleSheet.create({
  titleText: {
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  price: {},
});
