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

// TODO: allow users to logout
export default class Logout extends React.Component {
  componentDidMount() {
    firebaseSDK.logout();
    this.props.navigation.navigate("Login", {
      screen: "Login",
    });
  }

  render() {
    return null;
  }
}
