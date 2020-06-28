import React from "react";
import {
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { RNSlidingButton, SlideDirection } from "rn-sliding-button";
import { Header, Button, Avatar } from "react-native-elements";
// @flow
import { GiftedChat, MessageText, Message } from "react-native-gifted-chat";
import axios from "axios";
import firebase from "firebase";
import useForceUpdate from "use-force-update";

import firebaseSDK from "../config/firebaseSDK";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const resizeWidth = (w) => {
  return (value = w * (windowWidth / 375));
};

const resizeHeight = (h) => {
  return (value = h * (windowHeight / 872));
};

export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Chat!",
  });

  state = {
    messages: [],
    chatKey: this.props.route.params.chatKey,
    merchantname: this.props.route.params.merchantname,
    buyername: this.props.route.params.buyername,
    merchantuid: this.props.route.params.merchantuid,
    buyeruid: this.props.route.params.buyeruid,
    uri: null,
  };

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

  onSlideRightGenerator = (invoice_id, message_id, message_text) => {
    // add in props
    let onSlideRight = async () => {
      //perform Action on slide success.

      //invoice_id is available here
      console.log("Message ID: ");
      console.log(message_id);
      console.log("INVOICE ID: ");
      console.log(invoice_id);
      console.log("MESSAGE TEXT: ");
      console.log(message_text);

      var merchantName = message_text.split("\n")[1].split(":")[1];
      var buyerName = message_text.split("\n")[2].split(":")[1];
      var productName = message_text.split("\n")[3].split(":")[1];
      var priceAmount = message_text.split("\n")[4].split(":")[1];

      var makePaymentAPI =
        "https://khanhphungntu.ml/make_payment/" + invoice_id.toString();

      const idToken = await firebase.auth().currentUser.getIdToken(true);
      const forceUpdate = useForceUpdate();

      try {
        const response = await axios.post(
          makePaymentAPI,
          {},
          {
            headers: { Authorization: idToken },
          }
        );
        console.log(response.data);

        await firebaseSDK.markIsPaid(this.state.chatKey, message_id);
        console.log("marked paid");

        let ReceiptToSend =
          "Transaction ID: " +
          response.data.transaction_id +
          "\nInvoice ID: " +
          invoice_id +
          "\nMerchant: " +
          merchantName +
          "\nBuyer: " +
          buyerName +
          "\nProduct: " +
          productName +
          "\nPrice: " +
          priceAmount;

        console.log("Receipt: " + ReceiptToSend);

        await firebaseSDK.sendReceiptMessage(this.state.chatKey, {
          user: this.getCurrentUserDetails(),
          text: ReceiptToSend,
        });
        console.log("added receipt");

        Alert.alert(
          "Payment Successful!\nTransaction ID: " + response.data.transaction_id
        );
      } catch (error) {
        console.log("!!!!!!!!!!!!!ERROR!!!!!!!!!!!!!!");
        console.log(error);
        Alert.alert("Payment Failed. Please try again.");
      }
    };

    return onSlideRight;
  };

  // callback function
  onReceivePaymentDetails = async (productname, productprice) => {
    this.setState({ productname: productname });
    this.setState({ productprice: productprice });

    var currency = productprice.split(" ")[0];
    var price = productprice.split(" ")[1];
    var priceFloat = parseFloat(price);

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
      this.state.merchantname +
      "\nBuyer: " +
      this.state.buyername +
      "\nProduct: " +
      productname +
      "\nPrice: " +
      productprice;

    firebaseSDK.sendPaymentMessage(this.state.chatKey, {
      user: this.getCurrentUserDetails(),
      text: MessageToSend,
    });
  };

  onPressGeneratePaymentRequest = () => {
    this.props.navigation.navigate("Payment", {
      screen: "Payment",
      merchantname: this.state.merchantname,
      buyername: this.state.buyername,
      chatKey: this.state.chatKey,
      callback: this.onReceivePaymentDetails.bind(this),
    });
  };

  getCurrentUserUid = () => {
    var user = firebase.auth().currentUser;
    if (user != null) {
      return user.uid;
    }
  };

  renderCustomViewPayment = (props) => {
    // Transaction Record (Receipt)
    if (
      props.currentMessage.isPayment == true &&
      props.currentMessage.isPaid == true
    ) {
      let message_id = props.currentMessage._id;
      let message_text = props.currentMessage.text;
      let invoice_id = props.currentMessage.text.split("\n")[0].split(" ")[2];

      // // if it is right side (blue colour) merchant
      if (props.currentMessage.user.id == firebaseSDK.getCurrentUserUid()) {
        return (
          <View>
            <Text style={styles.PaymentText}>Transaction Details</Text>
          </View>
        );
      } else {
        return (
          <View>
            <Text style={styles.PaymentText2}>Transaction Details</Text>
          </View>
        );
      }
    } else if (
      // Invoice details (Not paid yet)
      props.currentMessage.isPayment == true &&
      props.currentMessage.isPaid == false
    ) {
      let message_id = props.currentMessage._id;
      let message_text = props.currentMessage.text;
      let invoice_id = props.currentMessage.text.split("\n")[0].split(" ")[2];

      // if it is right side (blue colour) merchant
      if (props.currentMessage.user.id == firebaseSDK.getCurrentUserUid()) {
        return (
          <View>
            <Text style={styles.PaymentText}>Invoice Details</Text>
          </View>
        );
      } else {
        // buyer
        return (
          <View>
            <Text style={styles.PaymentText2}>Invoice Details</Text>
            <RNSlidingButton
              style={{
                width: resizeWidth(248),
              }}
              height={resizeHeight(35)}
              onSlidingSuccess={this.onSlideRightGenerator(
                invoice_id,
                message_id,
                message_text
              )}
              slideDirection={SlideDirection.RIGHT}
            >
              <Image
                source={require("../../ChatAppV2/assets/SwipeGradient.png")}
                style={{
                  flex: 1,
                  position: "absolute",
                  width: resizeWidth(248),
                }}
              ></Image>

              <View>
                <Avatar
                  size="small"
                  rounded
                  source={
                    this.state.uri
                      ? { uri: this.state.uri }
                      : require("../assets/VisaLogo32by32.png")
                  }
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
        onSend={firebaseSDK.getSendMessageRef(this.state.chatKey)}
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
        <Image
          style={styles.logo}
          source={require("../../ChatAppV2/assets/P2PLogo.png")}
        />

        <Button
          title="  LAUNCH         PING2PAY"
          onPress={this.onPressGeneratePaymentRequest}
          buttonStyle={styles.PaymentButton}
        />

        <View style={{ flex: 1 }}>{chat}</View>
      </View>
    );
  }

  async getAvatar() {
    if (this.state.buyeruid == firebaseSDK.uid) {
      let uri = await firebaseSDK.getChatAvatar(this.state.merchantuid);
      this.setState({ uri: uri });
    }
  }
  
  componentDidMount() {
    firebaseSDK.getChat(this.state.chatKey, (message) => {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    });
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
    backgroundColor: "#16267D",
  },

  logo: {
    marginTop: resizeHeight(5),
    width: resizeWidth(30),
    height: resizeHeight(30),
    borderRadius: 80,
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
  },
});
