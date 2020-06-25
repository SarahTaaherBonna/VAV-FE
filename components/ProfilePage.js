import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import ImageEditor from "@react-native-community/image-editor";
import { Avatar, Header } from "react-native-elements";
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
  ImageBackground
} from "react-native";

import firebaseSDK from "../config/firebaseSDK";

// TODO: allow users to update profile
export default class ProfilePage extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    // oldpassword: "",
    // newpassword: "",
    avatar: "",
  };

  async componentDidMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    var username = dataObtainedFromFirebase.split(",")[0];
    var userEmail = dataObtainedFromFirebase.split(",")[1];
    this.setState({ name: username });
    this.setState({ email: userEmail });
    // this.state.name = username;
    // this.state.email = userEmail;
    console.log("----------------------------------");
    console.log(this.state.name);
    console.log(this.state.email);
  }

  onPressUpdate = async () => {
    try {
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        // oldpassword: this.state.oldpassword,
        // newpassword: this.state.newpassword,
      };
      console.log("=====================================");
      console.log(this.state.name);
      console.log(this.state.email);
      console.log(this.state.password);
      // console.log(this.state.oldpassword);
      // console.log(this.state.newpassword);
      await firebaseSDK.updateAccount(user);
    } catch ({ message }) {
      console.log("Update account failed. Catch error:" + message);
    }

    this.props.navigation.navigate("Home", {
      screen: "ProductListing",
    });
  };

  onChangeTextEmail = (email) => this.setState({ email });
  // onChangeTextOldPassword = (oldpassword) => this.setState({ oldpassword });
  // onChangeTextNewPassword = (newpassword) => this.setState({ newpassword });
  onChangeTextPassword = (password) => this.setState({ password });
  onChangeTextName = (name) => this.setState({ name });

  render() {
    return (
      <View>        
        <View 
          style={
            {
             marginTop:90,
             alignSelf:'center',
             height:500,
             width:350,
             borderRadius:30,
             backgroundColor:"#16267D"}
            }>
            
            <View style={{marginTop:80}}>
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
        </View>

        <View
        style={
            {
            marginTop:20,
            height:140,
            width:140,
            alignSelf:'center',
            borderRadius:70,
            position:"absolute",
            flex:1
            }
          }>
        <ImageBackground
          style={styles.logo} source={require("../../ChatAppV2/assets/person.png")}>
        </ImageBackground>
        </View>

        <View style={{alignSelf:"center",marginTop:560,position:"absolute"}}>
          <FlatButton text="UPDATE" onPress={this.onPressCreate}/>
          </View>
      </View>

    );
  }
}
      

const offset = 16;
const styles = StyleSheet.create({
  logo: {
    flex:1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position:"absolute"
  }, 

  buttonText: {
    marginLeft: offset,
    fontSize: 20,
    color:"#FFFFFF"
  },

  labeluser: {
    fontWeight:'bold',
    marginTop: 30,
    marginLeft: 40,
    marginBottom:5,
    fontSize:16,
    color:"#FFFFFF"
  },

  labeluser2: {
    fontWeight:'bold',
    marginTop: 30,
    marginLeft: 30,
    marginBottom:5,
    fontSize:16,
    color:"#FFFFFF"
  },

  inputuser: {
    alignSelf:"center",
    paddingHorizontal:15,
    width:300,
    height:50,
    borderColor:"#43519D",
    backgroundColor:"#283786",
    borderRadius:8,
    color:"#F7B600"
  },
});

