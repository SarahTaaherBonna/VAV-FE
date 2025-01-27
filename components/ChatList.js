import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from "react-native";
import { Avatar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebaseSDK from "../config/firebaseSDK";
import Loader from '../components/Loader';

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
    loading: false
  };

  generateChatListing = (chatKey, merchantname, buyername, merchantuid, buyeruid, text, uri) => {
    let short_text=text.split("\n")[0]
    
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
            height: resizeHeight(90),
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
            size="medium"
            rounded
            source={uri ? {uri: uri} : require('../assets/person.png')}
            containerStyle={{ backgroundColor: "#F7B600", padding: 4, marginTop:resizeHeight(8), marginLeft:resizeWidth(10),}}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              padding:5,
            }}
          >
            <Text style={styles.titleText}>{buyername}</Text>
            <Text style={styles.messageText}>{short_text}</Text>
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
    if (this.state.loading) {
      var loader = <Loader />
    }
    return (
      <View>
        {loader}
        {this.state.chatListings}
      </View>
      );
  }

  componentDidMount() {

    firebaseSDK.getChatList(async (chatKey, merchantname, buyername, merchantuid, buyeruid, text) => {
      this.setState({loading: true})
      let uri;

      if (firebaseSDK.uid == buyeruid){
        uri = await firebaseSDK.getChatAvatar(merchantuid);
      } else {
        uri = await firebaseSDK.getChatAvatar(buyeruid);
      }

      let newChatListing = this.generateChatListing(chatKey, merchantname, buyername, merchantuid, buyeruid, text, uri);

      this.setState((previousState) => ({
        chatListings: [...previousState.chatListings, newChatListing],
      }));

      this.setState({loading: false})

    });
  }

  componentWillUnmount() {
    firebaseSDK.closeChatListConnection();
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
