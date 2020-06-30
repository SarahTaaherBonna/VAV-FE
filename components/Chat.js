import React from "react";
import { View, Text, StyleSheet, Image, Alert, Dimensions } from "react-native";
import { Button } from "react-native-elements";
// @flow
import { GiftedChat } from "react-native-gifted-chat";
import axios from "axios";
import firebase from "firebase";
import Loader from "../components/Loader";
import firebaseSDK from "../config/firebaseSDK";
import Invoice from "./Invoice";

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
    showAlert: false,
    loading: false,
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

    const idToken = await firebase.auth().currentUser.getIdToken(true);
    try {
      const response = await axios.post(
        "https://khanhphungntu.ml/create_invoice/",
        data,
        {
          headers: { Authorization: idToken },
        }
      );
      
      this.setState({ invoiceid: response.data.invoice_id });
      let MessageToSend =
        "Invoice ID: " +
        response.data.invoice_id +
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
    } catch (error) {
      Alert.alert(
        "Payment Message unsuccessful"
      );
    }
  };

  setTimeoutFunction = (message_id) => {
    const chatKey = this.state.chatKey;
    setTimeout(async function () {
      await firebaseSDK.markIsTimeout(chatKey, message_id);
      let messages = await firebaseSDK.getChatOnce(this.state.chatKey);
      this.setState((previousState) => ({
        messages: GiftedChat.append([], messages),
      }));
    }, 3000);
    return null;
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

  setMessages = (messages) => {
    this.setState({
      messages: messages,
    });
  };

  setLoading = (isLoading) => {
    this.setState({
      loading: isLoading,
    });
  };

  renderCustomViewPayment = (props) => {
    // Transaction Record (Receipt)
    if (props.currentMessage.text == undefined) {
      return;
    }
    var messageFirstLine = props.currentMessage.text
      .split("\n")[0]
      .split(":")[0];
    if (
      // Invoice details (Paid yet)
      props.currentMessage.isPayment == true &&
      props.currentMessage.isPaid == true &&
      messageFirstLine == "Invoice ID"
    ) {
      let message_id = props.currentMessage._id;
      let message_text = props.currentMessage.text;
      let invoice_id = props.currentMessage.text.split("\n")[0].split(": ")[1];

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
          </View>
        );
      }
    } else if (
      props.currentMessage.isPayment == true &&
      props.currentMessage.isPaid == true &&
      messageFirstLine == "Transaction ID"
    ) {
      let message_id = props.currentMessage._id;
      let message_text = props.currentMessage.text;
      let invoice_id = props.currentMessage.text.split("\n")[1].split(": ")[1];

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
      props.currentMessage.isPaid == false &&
      messageFirstLine == "Invoice ID"
    ) {
      let message_id = props.currentMessage._id;
      let message_text = props.currentMessage.text;
      let invoice_id = props.currentMessage.text.split("\n")[0].split(": ")[1];
      if (
        props.currentMessage.isTimeout !== undefined &&
        props.currentMessage.isTimeout === true
      ) {
        if (props.currentMessage.user.id == firebaseSDK.getCurrentUserUid()) {
          return (
            <View>
              <Text style={styles.PaymentText3}>Invoice Timed Out</Text>
            </View>
          );
        } else {
          // buyer
          return (
            <View>
              <Text style={styles.PaymentText3}>Invoice Timed out</Text>
              <View
                style={{
                  width: "100%",
                }}
                height={resizeHeight(35)}
              >
                <Image
                  source={require("../../ChatAppV2/assets/GreyGradient.png")}
                  style={{
                    flex: 1,
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    alignSelf: "center",
                  }}
                ></Image>

                <Image
                  source={
                    this.state.uri
                      ? { uri: this.state.uri }
                      : require("../assets/visaCardIcon3.png")
                  }
                  style={{
                    height: resizeHeight(38),
                    width: resizeWidth(48),
                    resizeMode: "stretch",
                  }}
                />
              </View>
            </View>
          );
        }
      }
      return (
        <Invoice
          chatKey={this.state.chatKey}
          message_id={message_id}
          setMessages={this.setMessages}
          currentMessage={props.currentMessage}
          setLoading={this.setLoading}
          uri={this.state.uri}
          invoice_id={invoice_id}
          message_text={message_text}
        />
      );
    }
  };

  render() {
    if (this.state.loading) {
      var loader = <Loader />;
    }

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
        {loader}
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
    firebaseSDK.closeChatConnection();
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

  PaymentText3: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
  },

  PaymentButton: {
    backgroundColor: "#16267D",
  },

  logo: {
    marginTop: resizeHeight(5),
    width: resizeWidth(30),
    height: resizeHeight(30),
    borderRadius: resizeWidth(30) / 2,
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
  },
});
