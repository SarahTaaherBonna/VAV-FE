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
  ScrollView
} from "react-native";
import FlatButton2 from "../components/Button2";

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
      productname: this.state.productName,
      productprice: this.state.productPrice,
    });
  };

  onChangeTextBuyerName = (buyerName) => this.setState({ buyerName });
  onChangeTextMerchantName = (merchantName) => this.setState({ merchantName });
  onChangeTextProductName = (productName) => this.setState({ productName });
  onChangeTextProductPrice = (productPrice) => this.setState({ productPrice });

  render() {
    return (
      <ScrollView style={{ maxHeight: "100%" }}>
        <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? "padding" : null}>

        <Image style={styles.logo} source= {require("../../ChatAppV2/assets/P2PLogo.png")} />

          <View
            style={
              {
                marginTop: 110,
                alignSelf: 'center',
                height: 480,
                width: 350,
                borderRadius: 30,
                backgroundColor: "#F7B600",
                paddingTop:80,
                alignSelf:'center'
              }
            }>
        
        <Text style={styles.title}>BUYER'S NAME</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Please enter buyer's name"
          autoCorrect={false}
          onChangeText={this.onChangeTextBuyerName}
          value={this.state.buyerName}
        />
        <Text style={styles.title}>MERCHANT'S NAME</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Please enter merchant's name"
          autoCorrect={false}
          onChangeText={this.onChangeTextMerchantName}
          value={this.state.merchantName}
        />
        <Text style={styles.title}>PRODUCT'S NAME</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Please enter name of product"
          autoCorrect={false}
          onChangeText={this.onChangeTextProductName}
        />
        <Text style={styles.title}>PRICE</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Please enter price of product"
          autoCorrect={false}
          onChangeText={this.onChangeTextProductPrice}
          value={this.state.productPrice}
        />

        <View style={{margin:20}}>
          <FlatButton2 text="GENERATE PAYMENT REQUEST" onPress={this.onPressGeneratePaymentRequest}/>
        </View>

      </View>

      </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({

  logo: {
    margin:30,
    width: 150,
    height: 150,
    borderRadius: 80, 
    position: "absolute",
    alignSelf: "center",
    zIndex:10
  },

  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginHorizontal:15,
    fontSize: 16,
    color: "#FFFFFF"
  },
  nameInput: {
    marginBottom:10,
    marginTop:5,
    paddingHorizontal: 10,
    marginHorizontal:15,
    width: 320,
    height: 50,
    borderColor: "#43519D",
    backgroundColor: "#FFC524",
    borderRadius: 8,
    color: "#16267D",
    
  },
  buttonText: {
    marginLeft: offset,
    fontSize: 42,
  },



});
