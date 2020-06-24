import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import ImageEditor from "@react-native-community/image-editor";
import { Avatar, Header } from "react-native-elements";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";

import firebaseSDK from "../config/firebaseSDK";

// TODO: allow users to update profile
export default class ProfilePage extends React.Component {
  state = {
    name: this.props.state.name,
    email: this.props.state.email,
    password: this.props.state.password,
    avatar: this.props.state.avatar,
  };

  onPressUpdate = async () => {
    try {
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      };
      await firebaseSDK.updateAccount(user);
    } catch ({ message }) {
      console.log("Update account failed. Catch error:" + message);
    }
    this.props.navigation.navigate("Chat", {
      name: this.state.name,
      email: this.state.email,
      avatar: this.state.avatar,
    });
  };

  onChangeTextEmail = (email) => this.setState({ email });
  onChangeTextPassword = (password) => this.setState({ password });
  onChangeTextName = (name) => this.setState({ name });

  render() {
    return (
      <>
        {/* <Header
          statusBarProps={{ translucent: true }}
          centerComponent={{ text: "Chats", style: { color: "#fff" } }}
        /> */}
        <View>
          <Text style={styles.title}>Name:</Text>
          <TextInput
            style={styles.nameInput}
            onChangeText={this.onChangeTextName}
            value={this.state.name}
          />
          <Text style={styles.title}>Email:</Text>
          <TextInput
            style={styles.nameInput}
            onChangeText={this.onChangeTextEmail}
            value={this.state.email}
          />
          <Text style={styles.title}>Password:</Text>
          <TextInput
            style={styles.nameInput}
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={this.onChangeTextPassword}
            value={this.state.password}
          />

          <Button
            title="Update Profile"
            style={styles.buttonText}
            onPress={this.onPressUpdate}
          />
          <Button
            title="Update Avatar"
            style={styles.buttonText}
            onPress={this.onImageUpload}
          />
        </View>
      </>
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
