import React, { Component } from "react";
import { StyleSheet, View, Alert, Text, Image } from "react-native";
import { Card, ListItem, Button, Icon, Header } from "react-native-elements";
import firebase from "firebase";
import FlatButton from "../components/Button";
import axios from 'axios';
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

  functionCall = () =>{
    console.log("hereeeee");
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      console.log(idToken)
      const data = {
        email: "khanh26688@gmail.com",
        card_number: "4957030420210462", 
        full_name: "Khanh",
        expiry_date: "10/20",
        ccv: "022",
        uid: "Yo6m5z2panXU4jDAtTuzoeTE3hH3"
      }
      axios.get(`http://127.0.0.1:8000/`, data, { headers: { Authorization: idToken }})
      .then(res => {
        console.log(res.data);

      });
    }).catch(function(error) {
      // Handle error
      console.log("err");
      console.log(error);
    });
  }

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
          <Text onPress={this.functionCall} style={styles.titleText}>Blue-Yellow Camera</Text>
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
