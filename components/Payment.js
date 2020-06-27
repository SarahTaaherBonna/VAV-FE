import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";

import firebaseSDK from "../config/firebaseSDK";

export default class Payment extends React.Component {
  state = {
    buyerName: this.props.route.params.buyername,
    merchantName: this.props.route.params.merchantname,
    productName: "",
    productPrice: "SGD ",
    chatKey: this.props.route.params.chatKey,
    callback: this.props.route.params.callback,
  };

  onPressGeneratePaymentRequest = () => {
    console.log("^^^^^^^^^^^^^^^IN PAYMENT PAGE^^^^^^^^^^^^^^^^^^^^^");
    console.log("Buyer Name: " + this.state.buyerName);
    console.log("Merchant Name: " + this.state.merchantName);
    console.log("Product Name: " + this.state.productName);
    console.log("Product Price: " + this.state.productPrice);

    this.props.route.params.callback(
      this.state.merchantName,
      this.state.buyerName,
      this.state.productName,
      this.state.productPrice
    );

    this.props.navigation.navigate("Chat", {
      merchantname: this.state.merchantName,
      buyername: this.state.buyerName,
      productname: this.state.productName,
      productprice: this.state.productPrice,
      chatKey: this.state.chatKey,
    });
  };

  onChangeTextBuyerName = (buyerName) => this.setState({ buyerName });
  onChangeTextMerchantName = (merchantName) => this.setState({ merchantName });
  onChangeTextProductName = (productName) => this.setState({ productName });
  onChangeTextProductPrice = (productPrice) => this.setState({ productPrice });

  render() {
    return (
      <View>
        <Text style={styles.title}>Buyer's Name:</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Please enter buyer's name"
          autoCorrect={false}
          onChangeText={this.onChangeTextBuyerName}
          value={this.state.buyerName}
        />
        <Text style={styles.title}>Merchant's Name:</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Please enter merchant's name"
          autoCorrect={false}
          onChangeText={this.onChangeTextMerchantName}
          value={this.state.merchantName}
        />
        <Text style={styles.title}>Product:</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Please enter name of product"
          autoCorrect={false}
          onChangeText={this.onChangeTextProductName}
        />
        <Text style={styles.title}>Price:</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Please enter price of product"
          autoCorrect={false}
          onChangeText={this.onChangeTextProductPrice}
          value={this.state.productPrice}
        />

        <Button
          title="Generate Payment Request"
          style={styles.buttonText}
          onPress={this.onPressGeneratePaymentRequest}
        />
      </View>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: "#111111",
    borderWidth: 1,
    fontSize: offset,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: 42,
  },
});
