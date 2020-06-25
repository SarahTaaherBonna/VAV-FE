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
      <View>

        <Card
          image={require("../assets/Camera.png")}
          containerStyle={{
            marginTop:100,
            width: 160,
            height: 230,
            paddingRight: 10,
            borderRadius:8,
            borderColor:"#16267D",
            borderWidth:2
          }}
        >
          <Text style={styles.titleText}>Blue-Yellow Camera</Text>
          <Text style={styles.price}>$10</Text>
        </Card>

        <Card
          image={require("../assets/Camera.png")}
          containerStyle={{
            marginTop:100,
            marginRight:240,
            width: 160,
            height: 230,
            paddingRight: 10,
            borderRadius:8,
            borderColor:"#16267D",
            borderWidth:2
          }}
        >
          <Text style={styles.titleText}>Blue-Yellow Camera 2</Text>
          <Text style={styles.price}>$10</Text>
        </Card>
      
      <Card
        image={require("../assets/Camera.png")}
        containerStyle={{
          marginTop:50,
          width: 160,
          height: 180,
          paddingRight: 10,
          borderRadius:8,
          borderColor:"#16267D",
          borderWidth:2
        }}
      >
        
        <Text style={styles.titleText}>Blue-Yellow Camera</Text>
        <Text style={styles.price}>$10</Text>
      </Card>

      </View>
    );
  }
}

var styles = StyleSheet.create({
  titleText: {
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "left",
    fontSize:13,
    color:"#16267D"
  },
  price: {
    textAlign: "left",
    color:"#16267D"
  },
});
