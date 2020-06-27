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
    chatKey: this.props.route.params.chatKey,
    merchantname: this.props.route.params.merchantname,
    buyername: this.props.route.params.buyername,
    merchantuid: this.props.route.params.merchantuid,
    buyeruid: this.props.route.params.buyeruid,
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

  onSlideRightGenerator = (invoice_id, message_id) => {
    // add in props
    let onSlideRight = async () => {
      //perform Action on slide success.

      //invoice_id is available here
      console.log(message_id);
      console.log(invoice_id);

      var makePaymentAPI =
        "https://khanhphungntu.ml/make_payment/" + invoice_id.toString();

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

        await firebaseSDK.markIsPaid(this.state.chatKey, message_id);
        let ReceiptToSend =
          "Transaction ID: " +
          response.data.transaction_id +
          "\nMerchant: " +
          this.state.merchantname +
          "\nBuyer: " +
          this.state.buyername +
          "\nProduct: " +
          productname +
          "\nPrice: " +
          productprice;
        console.log("Receipt: " + ReceiptToSend);

        await firebaseSDK.sendReceiptMessage(this.state.chatKey, {
          user: this.getCurrentUserDetails(),
          text: ReceiptToSend,
        });

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
    if (
      props.currentMessage.isPayment == true &&
      props.currentMessage.isPaid == false
    ) {
      let message_id = props.currentMessage._id;
      let invoice_id = props.currentMessage.text.split("\n")[0].split(" ")[2];

      // if it is right side (blue colour) merchant
      if (props.currentMessage.user.id == firebaseSDK.getCurrentUserUid()) {
        return (
          <View>
            <Text style={styles.PaymentText}>Transaction Details</Text>
          </View>
        );
      } else {
        // buyer
        return (
          <View>
            <Text style={styles.PaymentText2}>Transaction Details</Text>
            <RNSlidingButton
              style={{
                width: 248,
              }}
              height={35}
              onSlidingSuccess={this.onSlideRightGenerator(
                invoice_id,
                message_id
              )}
              slideDirection={SlideDirection.RIGHT}
            >
              <Image
                source={require("../../ChatAppV2/assets/SwipeGradient.png")}
                style={{
                  flex: 1,
                  position: "absolute",
                  width: 248,
                }}
              ></Image>

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

  componentDidMount() {
    firebaseSDK.getChat(this.state.chatKey, (message) =>
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
    backgroundColor: "#16267D",
  },

  logo: {
    marginTop: 5,
    width: 30,
    height: 30,
    borderRadius: 80,
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
  },
});
