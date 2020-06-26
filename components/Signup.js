import React from "react";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from '@expo/vector-icons';
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
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import firebaseSDK from "../config/firebaseSDK";

export default class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.pickImage = this.pickImage.bind(this);
  }
  state = {
    name: "",
    email: "",
    password: "",
    avatar: "",
    image: null,
    setImage: false
  };

  onPressCreate = async () => {

    try {
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      };
      let account = await firebaseSDK.createAccount(user);

      if (account != false && this.state.image) {
        await  firebaseSDK.uploadImage(this.state.image, account.uid)
      }
    } catch ({ message }) {
      console.log("Create account failed. Catch error:" + message);
    }

    this.props.navigation.navigate("Add Credit Card Details", {
      screen: "CreditCard",
      isAdding: true,
    });
  };

  onChangeTextEmail = (email) => this.setState({ email });
  onChangeTextPassword = (password) => this.setState({ password });
  onChangeTextName = (name) => this.setState({ name });

  async useEffect() {
    if (Constants.platform.ios) {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  async pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri, setImage: true });
    }
  };

  render() {
    return (
      <ScrollView style={{ maxHeight: "100%" }}>
        <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? "padding" : null}>
          <View
            style={
              {
                marginTop: 130,
                alignSelf: 'center',
                height: 480,
                width: 350,
                borderRadius: 30,
                backgroundColor: "#16267D",
                paddingTop: 70
              }
            }>

            <Image style={styles.logo} source={this.state.setImage ? { uri: this.state.image } : require('../assets/person.png')} />

            <AntDesign onPress={() => { this.pickImage() }} style={styles.buttonText} name="camera" size={24} color="black" />

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

          <View style={{ alignSelf: "center", top: -25 }}>
            <FlatButton text="SIGN-UP" onPress={this.onPressCreate} />
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  logo: {
    top: -70,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "#16267D",
    position: "absolute",
    alignSelf: "center"
  },

  buttonText: {
    color: "#FFFFFF",
    alignSelf: 'center',
    backgroundColor: "#F7B600",
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    top: -30,
    left: 50
  },

  labeluser: {
    fontWeight: 'bold',
    marginLeft: 40,
    marginBottom: 5,
    fontSize: 16,
    color: "#FFFFFF"
  },

  labeluser2: {
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 30,
    marginBottom: 5,
    fontSize: 16,
    color: "#FFFFFF"
  },

  inputuser: {
    alignSelf: "center",
    paddingHorizontal: 15,
    width: 300,
    height: 50,
    borderColor: "#43519D",
    backgroundColor: "#283786",
    borderRadius: 8,
    color: "#F7B600"
  },
});
