import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Alert,
  Text,
  SafeAreaView,
  ScrollView,
  FlatView,
  Dimensions
} from "react-native";
import { Avatar, Header } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebaseSDK from "../config/firebaseSDK";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const resizeWidth = (w) => {
  return (value = w * (windowWidth / 375));
};

const resizeHeight = (h) => {
  return (value = h * (windowHeight / 872));
};

// TODO: create ChatList for user

export default class ChatList extends Component {
  state = {
    chatListings: [],
  };

  generateChatListing = (chatKey, merchantname, buyername, merchantuid, buyeruid, text, uri) => {
    let newChatListing = (
      <TouchableOpacity
        key = {chatKey}
        onPress={() => {
          this.onPressListing(chatKey, merchantname, buyername, merchantuid, buyeruid);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: resizeHeight(150),
            width: resizeWidth(340),
            padding:10,
            backgroundColor: "#16267D",
            borderRadius: 15,
            borderBottomLeftRadius: 100,
            borderTopLeftRadius: 100,
            margin:10,
          }}
        >
          <Avatar
            size="large"
            rounded
            source={uri ? {uri: uri} : require('../assets/person.png')}
            containerStyle={{ backgroundColor: "#F7B600", padding: 5, marginTop:resizeHeight(20), marginLeft:resizeWidth(10),}}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              padding:5,
            }}
          >
            <Text style={styles.titleText}>{buyername}</Text>
            <Text style={styles.messageText}>{text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
    return newChatListing;
  };

  onPressListing = (chatKey, merchantname, buyername, merchantuid, buyeruid) => {
    this.props.navigation.navigate("Chat", {
      chatKey: chatKey,
      merchantname: merchantname,
      buyername: buyername,
      merchantuid: merchantuid,
      buyeruid: buyeruid,
    });
  };

  render() {
    return this.state.chatListings;
  }

  componentDidMount() {
    firebaseSDK.getChatList(async (chatKey, merchantname, buyername, merchantuid, buyeruid, text) => {
      let uri
      if (firebaseSDK.uid == buyeruid){
        uri = await firebaseSDK.getChatAvatar(merchantuid);
      }
      else{
        uri = await firebaseSDK.getChatAvatar(buyeruid);
      }
      let newChatListing = this.generateChatListing(chatKey, merchantname, buyername, merchantuid, buyeruid, text, uri);
      this.setState((previousState) => ({
        chatListings: [...previousState.chatListings, newChatListing],
      }));
    });
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: resizeWidth(15),
    color: "white",
  },
  messageText: {
    fontSize: 14,
    paddingLeft: resizeWidth(15),
    color: "white",
    marginTop: resizeHeight(5),
  },

  contentContainer: {
    paddingVertical: resizeHeight(20),
  },
});
