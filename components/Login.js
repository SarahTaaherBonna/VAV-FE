import React from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Avatar, Header } from "react-native-elements";
import firebaseSDK from "../config/firebaseSDK";

// TODO: navigate to Chat List after login
export default class Login extends React.Component {
  static navigationOptions = {
    title: "Sign In",
  };

  state = {
    name: "Test0",
    email: "Test0@gmail.com",
    password: "Test00",
    avatar: "",
  };

  onPressLogin = async () => {
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      avatar: this.state.avatar,
    };

    const response = firebaseSDK.login(
      user,
      this.loginSuccess,
      this.loginFailed
    );
  };

  // TODO: navigate to Chat List after login
  loginSuccess = () => {
    console.log("login successful, navigate to Products.");
    // this.props.navigation.navigate("Chat", {
    //   name: this.state.name,
    //   email: this.state.email,
    //   avatar: this.state.avatar,
    // });
    // this.props.navigation.navigate("ChatList", {
    //   name: this.state.name,
    //   email: this.state.email,
    //   avatar: this.state.avatar,
    // });
    this.props.navigation.navigate("ProductListing", {});
  };

  loginFailed = () => {
    alert("Invalid Username and/or Password.");
  };

  onChangeTextEmail = (email) => this.setState({ email });
  onChangeTextPassword = (password) => this.setState({ password });

  render() {
    return (
      <>
        {/* <Header
          statusBarProps={{ translucent: true }}
          centerComponent={{ text: "Sign In", style: { color: "#fff" } }}
        /> */}
        <View>
          <Text style={styles.title}>Email:</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Please enter email"
            autoCorrect={false}
            onChangeText={this.onChangeTextEmail}
            value={this.state.email}
          />
          <Text style={styles.title}>Password:</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Please enter password"
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={this.onChangeTextPassword}
            value={this.state.password}
          />
          <Button
            title="Login"
            style={styles.buttonText}
            onPress={this.onPressLogin}
          />
          <TextInput returnKeyType={"go"} />
          <Button
            title="Signup"
            style={styles.buttonText}
            onPress={() => this.props.navigation.navigate("Signup")}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    marginLeft: 16,
    fontSize: 16,
  },
  nameInput: {
    height: 16 * 2,
    margin: 16,
    paddingHorizontal: 16,
    borderColor: "#111111",
    borderWidth: 1,
    fontSize: 16,
  },
  buttonText: {
    marginLeft: 16,
    fontSize: 42,
  },
});
