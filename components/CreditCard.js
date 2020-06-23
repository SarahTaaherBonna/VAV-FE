import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";

import { CreditCardInput } from "react-native-credit-card-input";
import { TextInput } from "react-native-gesture-handler";

const s = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

export default class Example extends Component {
  state = {
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  };
  _onChange = (formData) => {
    /* eslint no-console: 0 */
    console.log(JSON.stringify(formData, null, " "));
  };

  _onFocus = (field) => {
    /* eslint no-console: 0 */
    console.log(field);
  };

  onPressSubmit = async () => {
    this.props.navigation.navigate("Chat", {});
  };

  render() {
    return (
      <View style={s.container}>
        <CreditCardInput
          autoFocus
          requiresName
          requiresCVC
          labelStyle={s.label}
          inputStyle={s.input}
          validColor={"black"}
          invalidColor={"red"}
          placeholderColor={"darkgray"}
          allowScroll={true}

          //   onFocus={this._onFocus}
          //   onChange={this._onChange}
        />
        <TextInput returnKeyType={"go"} />
        <Button
          title="Submit"
          style={styles.buttonText}
          onPress={this.onPressSubmit}
        />
      </View>
    );
  }
}
const offset = 16;
const styles = StyleSheet.create({
  buttonText: {
    marginLeft: offset,
    fontSize: 42,
  },
});
