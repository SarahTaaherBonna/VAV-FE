import React from "react";
import {
  StyleSheet, Text, TextInput, View, Button, Image, ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Avatar, Header } from "react-native-elements";
import firebaseSDK from "../config/firebaseSDK";
import FlatButton from "../components/Button";

// TODO: navigate to Chat List after login
export default class Login extends React.Component {
  static navigationOptions = {
    title: "Login",
  };

  state = {
    name: "User1",
    email: "User1@gmail.com",
    password: "password",
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

  navigateToSignup = () => {
    console.log("Navigating to Sign up");

    this.props.navigation.navigate("Sign Up", {
      screen: "Signup",
    });
  };

  loginSuccess = () => {
    console.log("login successful, navigate to chat.");

    this.props.navigation.navigate("Home", {});
  };

  loginFailed = () => {
    alert("Invalid Username and/or Password.");
  };

  onChangeTextEmail = (email) => this.setState({ email });
  onChangeTextPassword = (password) => this.setState({ password });

  render() {
    return (
      <View style={{ backgroundColor: "#FFFFFF" }}>
        <Image
          style={styles.logo}
          source={require("../../ChatAppV2/assets/logo_replacement.png")}
        />
        <ScrollView>
          <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? "padding" : null}>
            <View
              style={{
                marginTop: 20,
                height: 600,
                borderRadius: 30,
                paddingHorizontal: "6%",
                backgroundColor: "#16267D",
              }}
            >
              <Text style={styles.labeluser}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.inputuser}
                placeholder="Please enter email"
                autoCorrect={false}
                onChangeText={this.onChangeTextEmail}
                value={this.state.email}
              />
              <Text style={styles.labeluser2}>PASSWORD</Text>
              <TextInput
                style={styles.inputuser2}
                placeholder="Please enter password"
                secureTextEntry={true}
                autoCorrect={false}
                onChangeText={this.onChangeTextPassword}
                value={this.state.password}
              />

              <TextInput returnKeyType={"go"} />

              <FlatButton text="LOGIN" onPress={this.onPressLogin} />

              <FlatButton text="SIGN-UP" onPress={this.navigateToSignup} />

              <Text style={styles.nameInput}>
                {" "}
            Create a new acccount if you are a new user{" "}
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
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
    textAlign: "center",
    marginBottom: 10,
    fontSize: 10,
    color: "#FFFFFF",
  },
  buttonText: {
    marginLeft: 16,
    fontSize: 42,
  },

  logo: {
    marginTop: 10,
    width: null,
    resizeMode: "contain",
    height: 250,
  },

  labeluser: {
    fontWeight: "bold",
    marginTop: 30,
    fontSize: 18,
    color: "#FFFFFF",
  },

  labeluser2: {
    fontWeight: "bold",
    marginTop: 15,
    fontSize: 18,
    color: "#FFFFFF",
  },

  inputuser: {
    marginBottom: 10,
    marginTop: 5,
    paddingHorizontal: 16,
    width: "100%",
    height: 50,
    borderColor: "#43519D",
    backgroundColor: "#283786",
    borderRadius: 8,
    color: "#F7B600",
  },

  inputuser2: {
    marginBottom: 20,
    marginTop: 5,
    paddingHorizontal: 16,
    width: "100%",
    height: 50,
    borderColor: "#43519D",
    backgroundColor: "#283786",
    borderRadius: 8,
    color: "#F7B600",
  },

  buttons: {
    margin: 16,
    paddingHorizontal: 16,
    width: 300,
    height: 50,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },

  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    height: 667,
  },
});
