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
    name: "",
    email: "",
    oldpassword: "",
    newpassword: "",
    avatar: "",
  };

  componentDidMount() {
    var dataObtainedFromFirebase = firebaseSDK.getAccountDetails();
    var username = dataObtainedFromFirebase.split(",")[0];
    var userEmail = dataObtainedFromFirebase.split(",")[1];
    this.state.name = username;
    this.state.email = userEmail;
    console.log("----------------------------------");
    console.log(this.state.name);
    console.log(this.state.email);
  }

  onPressUpdate = async () => {
    try {
      const user = {
        name: this.state.name,
        email: this.state.email,
        oldpassword: this.state.oldpassword,
        newpassword: this.state.newpassword,
      };
      console.log("=====================================");
      console.log(this.state.name);
      console.log(this.state.email);
      console.log(this.state.oldpassword);
      console.log(this.state.newpassword);
      await firebaseSDK.updateAccount(user);
    } catch ({ message }) {
      console.log("Update account failed. Catch error:" + message);
    }

    this.props.navigation.navigate("Home", {
      screen: "ProductListing",
    });
  };

  onChangeTextEmail = (email) => this.setState({ email });
  onChangeTextOldPassword = (oldpassword) => this.setState({ oldpassword });
  onChangeTextNewPassword = (newpassword) => this.setState({ newpassword });
  onChangeTextName = (name) => this.setState({ name });

  render() {
    return (
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
        <Text style={styles.title}>Old Password:</Text>
        <TextInput
          style={styles.nameInput}
          secureTextEntry={true}
          autoCorrect={false}
          onChangeText={this.onChangeTextOldPassword}
          value={this.state.oldpassword}
        />

        <Text style={styles.title}>New Password:</Text>
        <TextInput
          style={styles.nameInput}
          secureTextEntry={true}
          autoCorrect={false}
          onChangeText={this.onChangeTextNewPassword}
          value={this.state.newpassword}
        />

        <Button
          title="Update Profile"
          style={styles.buttonText}
          onPress={this.onPressUpdate}
        />
        <TextInput returnKeyType={"go"} />
        <Button
          title="Update Avatar"
          style={styles.buttonText}
          onPress={this.onImageUpload}
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
