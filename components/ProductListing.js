import React, { Component } from "react";
import { StyleSheet, View, Alert, Text, Image } from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";

// TODO: create ChatList for user

export default class ProductListing extends Component {
  state = {
    productName: "",
    productPrice: "",
    productDescription: "",
    productImage: "",
  };

  render() {
    return (
      <Card
        //   title="Desktop"
        image={require("../assets/Camera.png")}
        containerStyle={{
          width: 160,
          height: 230,
          paddingRight: 10,
        }}
      >
        <Text style={styles.titleText}>Blue-Yellow Camera</Text>
        {/* <Text style={{ marginBottom: 10 }}>
          This is a dummy product description
        </Text> */}
        <Text style={styles.price}>$10</Text>
      </Card>
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
