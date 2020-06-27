import React from "react";
import {
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
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
import axios from "axios";
import firebase from "firebase";
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
    merchantuid: "",
    buyeruid: "",
    invoiceid: "",
  };

  async UNSAFE_componentWillMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    console.log(dataObtainedFromFirebase);
    var userUID = dataObtainedFromFirebase.split(",")[2];
    var username = dataObtainedFromFirebase.split(",")[0];
    this.setState({ merchantname: username });
    this.setState({ merchantuid: userUID });
    // console.log("++++++++In Chat Page+++++++++++++");
    // console.log("Merchant Name: " + this.state.merchantname);
    var user1 = this.chatKey.split("_")[0];
    var user2 = this.chatKey.split("_")[1];
    if (userUID == user1) {
      var buyerUID = user2;
    } else {
      var buyerUID = user1;
    }

    this.setState({ buyeruid: buyerUID });
    console.log(this.state.merchantuid);
    console.log(this.state.buyeruid);
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

  // add in props
  onSlideRight = async () => {
    //perform Action on slide success.

    // add props.currentMessage.isPaid = true
    var makePaymentAPI =
      "https://khanhphungntu.ml/make_payment/" +
      this.state.invoiceid.toString();
    const idToken = await firebase.auth().currentUser.getIdToken(true);

    try {
      const response = await axios.post(
        makePaymentAPI,
        {},
        {
          headers: { Authorization: idToken },
        }
      );
      console.log(response.data);
      Alert.alert(
        "Payment Successful!\nTransaction ID: " + response.data.transaction_id
      );
      // props.currentMessage.isPaid = true
    } catch (error) {
      console.log("!!!!!!!!!!!!!ERROR!!!!!!!!!!!!!!");
      console.log(error);
    }
  };

  // callback function
  onReceivePaymentDetails = async (
    merchantname,
    buyername,
    productname,
    productprice,
    invoiceid
  ) => {
    this.setState({ merchantname: merchantname });
    this.setState({ buyername: buyername });
    this.setState({ productname: productname });
    this.setState({ productprice: productprice });

    var price = productprice.split(" ")[1];
    var priceFloat = parseFloat(price);
    var currency = productprice.split(" ")[0];

    var data = {
      seller_id: this.state.merchantuid,
      buyer_id: this.state.buyeruid,
      currency: currency,
      amount: priceFloat,
      description: productname,
    };

    console.log(data);

    const idToken = await firebase.auth().currentUser.getIdToken(true);
    try {
      const response = await axios.post(
        "https://khanhphungntu.ml/create_invoice/",
        data,
        {
          headers: { Authorization: idToken },
        }
      );
      console.log(response.data);
      this.setState({ invoiceid: response.data.invoice_id });
    } catch (error) {
      console.log("*************ERROR!!!!!!!!!!!!!!");
      console.log(error);
    }

    let MessageToSend =
      "Invoice ID: " +
      this.state.invoiceid +
      "\nMerchant: " +
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

  renderCustomViewPayment = async (props) => {
    // const currentUserDetails = await firebaseSDK.getAccountDetails();
    // var currentUserUID = currentUserDetails.split(",")[2];
    // add props.currentMessage.isPaid == false && currentUserUID == this.state.buyeruid
    if (props.currentMessage.isPayment == true) {
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
    // else if (props.currentMessage.isPaid == true) {
    //   return (
    //     <View>
    //       <Text style={styles.PaymentText}>Transaction Details</Text>
    //       </View>
    //   )
    // }
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
      <View style={{ flex: 1 }}>
        <Button
          title="Generate Payment Request"
          onPress={this.onPressGeneratePaymentRequest}
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
    color: "#FFF",
    textAlign: "center",
  },
});
