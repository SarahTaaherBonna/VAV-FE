import React, { Component } from "react";
import { StyleSheet, View, Alert, Text, Image } from "react-native";
import { Card, ListItem, Button, Icon, Header } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ChatList from "./ChatList";
import ProfilePage from "./ProfilePage";
// TODO: create ChatList for user

const Tab = createBottomTabNavigator();

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
        {/* <Header
          statusBarProps={{ translucent: true }}
          centerComponent={{ text: "Products", style: { color: "#fff" } }}
        /> */}
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
        {/* <Tab.Navigator>
          <Tab.Screen name="ProductListing" component={ProductListing} />
          <Tab.Screen name="ChatList" component={ChatList} />
          <Tab.Screen name="ProfilePage" component={ProfilePage} />
        </Tab.Navigator> */}
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
