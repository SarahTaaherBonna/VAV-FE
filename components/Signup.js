import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import ImageEditor from "@react-native-community/image-editor";
import FlatButton from "../components/Button";
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

import firebaseSDK from "../config/firebaseSDK";

export default class Signup extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    avatar: "",
  };

  onPressCreate = async () => {
    try {
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      };

      const response = firebaseSDK.createAccount(user, this.signupSuccess);
    } catch ({ message }) {
      console.log("Create account failed. Catch error:" + message);
    }
  };

  signupSuccess = () => {
    console.log("sign up successful, navigate to credit card page.");

    this.props.navigation.navigate("Add Credit Card Details", {
      screen: "CreditCard",
    });
  };

  onChangeTextEmail = (email) => this.setState({ email });
  onChangeTextPassword = (password) => this.setState({ password });
  onChangeTextName = (name) => this.setState({ name });

  //   // Need to fix avatar upload
  //   onImageUpload = async () => {
  //     const { status: cameraRollPerm } = await Permissions.askAsync(
  //       Permissions.CAMERA_ROLL
  //     );
  //     try {
  //       // only if user allows permission to camera roll
  //       if (cameraRollPerm === "granted") {
  //         // let pickerResult = await ImagePicker.launchImageLibraryAsync({
  //         //   allowsEditing: true,
  //         //   aspect: [4, 3],
  //         // });
  //         let pickerResult = await ImagePicker.launchImageLibraryAsync();
  //         console.log(
  //           "ready to upload... pickerResult json:" + JSON.stringify(pickerResult)
  //         );

  //         // var wantedMaxSize = 150;
  //         // var rawheight = pickerResult.height;
  //         // var rawwidth = pickerResult.width;
  //         // var ratio = rawwidth / rawheight;
  //         // var wantedwidth = wantedMaxSize;
  //         // var wantedheight = wantedMaxSize / ratio;
  //         // // check vertical or horizontal
  //         // if (rawheight > rawwidth) {
  //         //   wantedwidth = wantedMaxSize * ratio;
  //         //   wantedheight = wantedMaxSize;
  //         // }
  //         // let resizedUri = await new Promise((resolve, reject) => {
  //         //   ImageEditor.cropImage(
  //         //     pickerResult.uri,
  //         //     {
  //         //       offset: { x: 0, y: 0 },
  //         //       size: { width: pickerResult.width, height: pickerResult.height },
  //         //       displaySize: { width: wantedwidth, height: wantedheight },
  //         //       resizeMode: "contain",
  //         //     },
  //         //     (uri) => resolve(uri),
  //         //     () => reject()
  //         //   );
  //         // });
  //         // let uploadUrl = await firebaseSDK.uploadImage(resizedUri);
  //         let uploadUrl = await firebaseSDK.uploadImage(pickerResult);
  //         this.setState({ avatar: uploadUrl });
  //         await firebaseSDK.updateAvatar(uploadUrl);
  //       }
  //     } catch (err) {
  //       console.log("onImageUpload error:" + err.message);
  //       alert("Upload image error:" + err.message);
  //     }
  //   };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={200}>

        <ScrollView
          style={{
            marginTop: 130,
            alignSelf: "center",
            height: 500,
            width: 350,
            borderRadius: 30,
            backgroundColor: "#16267D",
          }}
        >
          <View style={{ marginTop: 80 }}>
            <Button
              title="UPLOAD AVATAR"
              alignSelf="center"
              style={styles.buttonText}
              onPress={this.onImageUpload}
            />
          </View>

          <Text style={styles.labeluser}>NAME</Text>
          <TextInput
            style={styles.inputuser}
            placeholder="Please enter name"
            onChangeText={this.onChangeTextName}
            value={this.state.name}
          />
          <Text style={styles.labeluser2}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.inputuser}
            placeholder="Please enter email"
            onChangeText={this.onChangeTextEmail}
            value={this.state.email}
          />
          <Text style={styles.labeluser2}>PASSWORD</Text>
          <TextInput
            style={styles.inputuser}
            placeholder="Please enter password"
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={this.onChangeTextPassword}
            value={this.state.password}
          />
        </ScrollView>

        <View
          style={{
            marginTop: 60,
            height: 140,
            width: 140,
            alignSelf: "center",
            borderRadius: 70,
            position: "absolute",
            flex: 1,
          }}
        >
          <ImageBackground
            style={styles.logo}
            source={require("../../ChatAppV2/assets/person.png")}
          ></ImageBackground>
        </View>

        <View
          style={{ alignSelf: "center", marginTop: 600, position: "absolute" }}
        >
          <FlatButton text="SIGN-UP" onPress={this.onPressCreate} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  logo: {
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
  },

  buttonText: {
    marginLeft: offset,
    fontSize: 20,
    color: "#FFFFFF",
  },

  labeluser: {
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: 40,
    marginBottom: 5,
    fontSize: 16,
    color: "#FFFFFF",
  },

  labeluser2: {
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: 30,
    marginBottom: 5,
    fontSize: 16,
    color: "#FFFFFF",
  },

  inputuser: {
    alignSelf: "center",
    paddingHorizontal: 15,
    width: 300,
    height: 50,
    borderColor: "#43519D",
    backgroundColor: "#283786",
    borderRadius: 8,
    color: "#F7B600",
  },
});
