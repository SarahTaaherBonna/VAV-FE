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
      <View style={{marginTop:50,marginLeft:40,height:250,backgroundColor:"#F7B600",borderTopStartRadius:15,borderBottomLeftRadius:15}}>

        <Card
          image={require("../assets/Camera.png")}
          containerStyle={{
            marginTop:40,
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
      </View>

      <View style={{marginTop:50,marginRight:40,height:250,backgroundColor:"#F7B600",borderTopEndRadius:15,borderBottomRightRadius:15}}>

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
