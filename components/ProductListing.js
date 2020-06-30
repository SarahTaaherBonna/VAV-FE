import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import firebase from "firebase";
import axios from "axios";

import { TouchableOpacity } from "react-native-gesture-handler";
import firebaseSDK from "../config/firebaseSDK";

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
    seller:"Sold by Gabriella",
    image: require("../../ChatAppV2/assets/Sunglasses.png"),
    merchantname: "Gabriella Benedicta",
    merchantuid: "W1BGs4VGudXJmMYzQxUjvAH9mys1",
  },
  {
    id: 2,
    name: "Headphones",
    price: "$145",
    seller:"Sold by Rakshitha",
    image: require("../../ChatAppV2/assets/Headphones.png"),
    merchantname: "Rakshitha Arun",
    merchantuid: "lduT2PAELobTfMatjzfWivgqL0n1",
  },
  {
    id: 3,
    name: "Bag",
    price: "$128",
    seller:"Sold by Palak",
    image: require("../../ChatAppV2/assets/Bag.png"),
    merchantname: "Palak Somani",
    merchantuid: "JEMvm4wXz3fYfgTvzwwBMXmKlg33",
  },
  {
    id: 4,
    name: "Speakers",
    price: "$95",
    seller:"Sold by Khanh",
    image: require("../../ChatAppV2/assets/Speakers.png"),
    merchantname: "Khanh Phung",
    merchantuid: "mcHwPy6qFAPCprN9pLPXHUS1pO63",
  },
  {
    id: 5,
    name: "Powerbank",
    price: "$79",
    seller:"Sold by Daniel",
    image: require("../../ChatAppV2/assets/Powerbank.png"),
    merchantname: "Daniel Wong",
    merchantuid: "JEIrJHSEzBhJNflD80ZvVx4zf4t2",
  },
  {
    id: 6,
    name: "Mouse",
    price: "$75",
    seller:"Sold by Sarah",
    image: require("../../ChatAppV2/assets/Mouse.png"),
    merchantname: "Sarah Taaher Bonna",
    merchantuid: "y2bsx6pEwpWWNsENsZwrA78LRS82",
  },
];

export default class ProductListing extends Component {

  render() {

    let user = firebaseSDK.getAccountDetails();
    let buyername = user.split(',')[0]
    let buyeruid = user.split(',')[2]

    return (
      <Container>
        <ScrollView>
          <View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
            {ListData.map((item, i) => {
              return (
                <Card1 key={i}>
                  <Image source={item.image} style={styles.image} />

                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {

                      let chatKey = ""
                      if (buyeruid < item.merchantuid) {
                        chatKey = buyeruid + "_" + item.merchantuid;
                      } else {
                        chatKey = item.merchantuid + "_" + buyeruid;
                      }

                      this.props.navigation.navigate("Chats", {
                        screen: "Chat", 
                        params: {
                          chatKey: chatKey,
                          merchantname: buyername,
                          buyername: item.merchantname,
                          merchantuid: buyeruid,
                          buyeruid: item.merchantuid,
                        }
                      });
                    }}
                  >
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
                        source={require("../../ChatAppV2/assets/P2PLogo.png")}
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
                  <Text style={styles.title3}>{item.seller}</Text>
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
    marginTop: 163,
    marginLeft: 5,
    color: "#FFFFFF",
    padding: 5,
    position: "absolute",
  },

  title2: {
    fontSize: 14,
    marginTop: 185,
    marginLeft: 5,
    color: "#FFFFFF",
    padding: 5,
    position: "absolute",
  },

  title3: {
    fontSize: 14,
    marginTop: 205,
    marginLeft: 5,
    color: "#FFFFFF",
    padding: 5,
    position: "absolute",
  },
});
