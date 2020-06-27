import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Card, ListItem, Button, Icon, Header } from "react-native-elements";
import firebase from "firebase";
import FlatButton from "../components/Button";
import axios from "axios";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ChatList from "./ChatList";
import ProfilePage from "./ProfilePage";
import { TouchableOpacity } from "react-native-gesture-handler";

const resizeComponent = (value, percentage) => {
  return value - value * (percentage / 100);
};

const Window = {
  Height: Dimensions.get("window").height,
  Width: Dimensions.get("window").width,
};

const CardContainerSize = {
  Width: resizeComponent(Window.Width, 50),
  Height: resizeComponent(300, 5),
};

const ListData = [
  {
    id: 1,
    name: "Sunglasses",
    price: "$159",
    image: require("../../ChatAppV2/assets/Sunglasses.png"),
  },
  {
    id: 2,
    name: "Headphones",
    price: "$145",
    image: require("../../ChatAppV2/assets/Headphones.png"),
  },
  {
    id: 3,
    name: "Bag",
    price: "$128",
    image: require("../../ChatAppV2/assets/Bag.png"),
  },
  {
    id: 4,
    name: "Speakers",
    price: "$95",
    image: require("../../ChatAppV2/assets/Speakers.png"),
  },
  {
    id: 3,
    name: "Powerbank",
    price: "$79",
    image: require("../../ChatAppV2/assets/Powerbank.png"),
  },
  {
    id: 4,
    name: "Mouse",
    price: "$75",
    image: require("../../ChatAppV2/assets/Mouse.png"),
  },
];

export default class ProductListing extends Component {
  state = {
    productName: "",
    productPrice: "",
    productDescription: "",
    productImage: "",
  };

  functionCall = () => {
    console.log("hereeeee");
    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        console.log(idToken);
        const data = {
          email: "khanh26688@gmail.com",
          card_number: "4957030420210462",
          full_name: "Khanh",
          expiry_date: "10/20",
          ccv: "022",
          uid: "Yo6m5z2panXU4jDAtTuzoeTE3hH3",
        };
        axios
          .get(`http://127.0.0.1:8000/`, data, {
            headers: { Authorization: idToken },
          })
          .then((res) => {
            console.log(res.data);
          });
      })
      .catch(function (error) {
        // Handle error
        console.log("err");
        console.log(error);
      });
  };

  render() {
    return (
      <Container>
        <ScrollView>
          <View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
            {ListData.map((item, i) => {
              return (
                <Card1 key={i}>
                  <Image source={item.image} style={styles.image} />

                  <TouchableOpacity>
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 15,
                        backgroundColor: "#ffc524",
                        alignSelf: "center",
                        marginTop: 10,
                        marginLeft: 110,
                      }}
                    >
                      <Image
                        source={require("../../ChatAppV2/assets/money.png")}
                        style={{
                          width: 5,
                          height: 10,
                          margin: 10,
                          resizeMode: "contain",
                          padding: 15,
                          alignSelf: "center",
                        }}
                      ></Image>
                    </View>
                  </TouchableOpacity>

                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.title2}>{item.price}</Text>
                </Card1>
              );
            })}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

class Container extends Component {
  render() {
    return <View style={styles.container}>{this.props.children}</View>;
  }
}

class Card1 extends Component {
  render() {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>{this.props.children}</View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#16267D",
    paddingTop: 5,
    paddingBottom: 0,
  },

  cardContainer: {
    height: 260,
    width: CardContainerSize.Width,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    height: resizeComponent(300, 20),
    width: resizeComponent(CardContainerSize.Width, 5),
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "#F7B600",
  },

  image: {
    width: resizeComponent(CardContainerSize.Width, 5),
    height: 160,
    resizeMode: "contain",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 170,
    marginLeft: 5,
    color: "#FFFFFF",
    padding: 5,
    position: "absolute",
  },

  title2: {
    fontSize: 14,
    marginTop: 200,
    marginLeft: 5,
    color: "#FFFFFF",
    padding: 5,
    position: "absolute",
  },
});
