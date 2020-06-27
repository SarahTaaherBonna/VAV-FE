import React from "react";
import {
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image
} from "react-native";
import { RNSlidingButton, SlideDirection } from "rn-sliding-button";
import { Header, Button, Avatar } from "react-native-elements";
// @flow
import {
  GiftedChat,
  MessageText,
  SystemMessage,
  Message,
  Bubble,
} from "react-native-gifted-chat";
import firebaseSDK from "../config/firebaseSDK";

export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Chat!",
  });

  state = {
    messages: [],
    merchantname: "",
    buyername: "",
    productname: "",
    productprice: "",
  };

  async UNSAFE_componentWillMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    console.log(dataObtainedFromFirebase);
    var userUID = dataObtainedFromFirebase.split(",")[2];
    var username = dataObtainedFromFirebase.split(",")[0];
    this.setState({ merchantname: username });
    // console.log("++++++++In Chat Page+++++++++++++");
    // console.log("Merchant Name: " + this.state.merchantname);
    var user1 = this.chatKey.split("_")[0];
    var user2 = this.chatKey.split("_")[1];
    if (userUID == user1) {
      var buyerUID = user2;
    } else {
      var buyerUID = user1;
    }

    await firebaseSDK.getNameFromUid(buyerUID, (name) => {
      this.setState({ buyername: name });
      // console.log("Buyer Name: " + this.state.buyername);
    });
  }

  getCurrentUserDetails() {
    const userDetails = firebaseSDK.getAccountDetails();

    let name = userDetails.split(",")[0];
    let email = userDetails.split(",")[1];
    let id = userDetails.split(",")[2];

    return {
      name: name,
      email: email,
      avatar: "",
      id: id,
      _id: id,
    };
  }

  get chatKey() {
    return this.props.route.params.chatKey;
  }

  onSlideRight = () => {
    //perform Action on slide success.
    console.log("Payment Success!");
  };

  // callback function
  onReceivePaymentDetails = (
    merchantname,
    buyername,
    productname,
    productprice
  ) => {
    this.setState({ merchantname: merchantname });
    this.setState({ buyername: buyername });
    this.setState({ productname: productname });
    this.setState({ productprice: productprice });

    let MessageToSend =
      "Merchant: " +
      merchantname +
      "\nBuyer: " +
      buyername +
      "\nProduct: " +
      productname +
      "\nPrice: " +
      productprice;

    firebaseSDK.sendPaymentMessage(this.chatKey, {
      user: this.getCurrentUserDetails(),
      text: MessageToSend,
    });
  };

  onPressGeneratePaymentRequest = () => {
    this.props.navigation.navigate("Payment", {
      screen: "Payment",
      merchantname: this.state.merchantname,
      buyername: this.state.buyername,
      chatKey: this.chatKey,
      callback: this.onReceivePaymentDetails.bind(this),
    });
  };

  renderCustomViewPayment = (props) => {
    if (props.currentMessage.isPayment == true) {
      const messageToSend =
        "Buyer: " +
        this.state.buyername +
        "\nMerchant: " +
        this.state.merchantname +
        "\nProduct: " +
        this.state.productname +
        "\nPrice: " +
        this.state.productprice;

        if(props.currentMessage.user.id==firebaseSDK.getCurrentUserUid()) {
        return (
          <View>
            <Text style={styles.PaymentText}>Transaction Details</Text>
            <RNSlidingButton
              style={{
                width: 248,
              }}
              height={35}
              onSlidingSuccess={this.onSlideRight}
              slideDirection={SlideDirection.RIGHT}
            >
              <Image source={require("../../ChatAppV2/assets/SwipeGradient.png")}
              
              style={{
                flex:1,
                position:'absolute',
                width:248,
              }}>

              </Image>
              <View>
                <Avatar
                  size="small"
                  rounded
                  source={{
                    uri:
                      "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
                  }}
                />
              </View>
            </RNSlidingButton>
          </View>
        );
    }

    else {

      return (
        <View>
          <Text style={styles.PaymentText2}>Transaction Details</Text>
          <RNSlidingButton
            style={{
              width: 248,
            }}
            height={35}
            onSlidingSuccess={this.onSlideRight}
            slideDirection={SlideDirection.RIGHT}
          >
            <Image source={require("../../ChatAppV2/assets/SwipeGradient.png")}
            
            style={{
              flex:1,
              position:'absolute',
              width:248,
            }}>

            </Image>
            <View>
              <Avatar
                size="small"
                rounded
                source={{
                  uri:
                    "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
                }}
              />
            </View>
          </RNSlidingButton>
        </View>
      );
    }
  }
  };

  render() {
    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSDK.getSendMessageRef(this.chatKey)}
        user={this.getCurrentUserDetails()}
        renderCustomView={this.renderCustomViewPayment}
        isTyping={true}
        renderUsernameOnMessage={true}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        isLoadingEarlier={true}
        isCustomViewBottom={false}
        wrapperStyle={{
          right: {
            backgroundColor: "#16267D",
          },
          left: {
            backgroundColor: "#F7B600",
          },
        }}
      />
    );
    return (
      <View style={{ flex: 1}}>

        <Image style={styles.logo} source= {require("../../ChatAppV2/assets/P2PLogo.png")} />

        <Button
          title="  LAUNCH         PING2PAY"
          onPress={this.onPressGeneratePaymentRequest}
          buttonStyle={styles.PaymentButton}
        />
        <View style={{ flex: 1 }}>{chat}</View>
      </View>
    );
  }

  componentDidMount() {
    firebaseSDK.getChat(this.chatKey, (message) =>
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    firebaseSDK.closeConnection();
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: "#F7B600",
  },

  PaymentText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },

  PaymentText2: {
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
  },

  PaymentButton: {
   backgroundColor:"#16267D",
  },

  logo: {
    marginTop:5,
    width: 30,
    height: 30,
    borderRadius: 80, 
    position: "absolute",
    alignSelf: "center",
    zIndex:10
  },
});
