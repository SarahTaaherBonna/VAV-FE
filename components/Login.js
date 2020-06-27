import React from "react";
import {
  StyleSheet, Text, TextInput, View, Button, Image, ScrollView,
  KeyboardAvoidingView,Dimensions
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Avatar, Header } from "react-native-elements";
import firebaseSDK from "../config/firebaseSDK";
import FlatButton from "../components/Button";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const resizeWidth=(w)=> {
  return value=w*(windowWidth/375);
}

const resizeHeight=(h)=> {
  return value=h*(windowHeight/872);
}

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
    marginTop: resizeHeight(16),
    marginLeft: resizeWidth(16),
    fontSize: 16,
  },

  nameInput: {
    textAlign: "center",
    marginBottom: resizeHeight(10),
    fontSize: 10,
    color: "#FFFFFF",
  },

  logo: {
    marginTop: resizeHeight(10),
    width: null,
    resizeMode: "contain",
    height: resizeHeight(280),
  },

  labeluser: {
    fontWeight: "bold",
    marginTop: resizeHeight(30),
    fontSize: 18,
    color: "#FFFFFF",
  },

  labeluser2: {
    fontWeight: "bold",
    marginTop: resizeHeight(15),
    fontSize: 18,
    color: "#FFFFFF",
  },

  inputuser: {
    marginBottom:resizeHeight(10),
    marginTop:resizeHeight(5),
    paddingHorizontal: resizeWidth(16),
    width: "100%",
    height: resizeHeight(50),
    borderColor: "#43519D",
    backgroundColor: "#283786",
    borderRadius: 8,
    color: "#F7B600",
  },

  inputuser2: {
    marginBottom: resizeHeight(20),
    marginTop: resizeHeight(5),
    paddingHorizontal: resizeWidth(16),
    width: "100%",
    height: resizeHeight(50),
    borderColor: "#43519D",
    backgroundColor: "#283786",
    borderRadius: 8,
    color: "#F7B600",
  },

});
