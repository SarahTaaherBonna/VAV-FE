import React from "react";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import FlatButton from "../components/Button";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import Loader from "../components/Loader";
import firebaseSDK from "../config/firebaseSDK";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const resizeWidth = (w) => {
  return (value = w * (windowWidth / 375));
};

const resizeHeight = (h) => {
  return (value = h * (windowHeight / 872));
};

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
    setImage: false,
    loading: false,
  };

  onPressCreate = async () => {
    try {
      this.setState({ loading: true });
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      };
      let account = await firebaseSDK.createAccount(user);

      if (account != false && this.state.image) {
        await firebaseSDK.uploadImage(this.state.image, account.uid);
      }

      firebaseSDK.updateName(account.uid, this.state.name);
      this.setState({ loading: false });
    } catch ({ message }) {
      console.log("Create account failed. Catch error:" + message);
      this.setState({ loading: false });
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
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
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
  }

  render() {
    if (this.state.loading) {
      var loader = <Loader />;
    }
    return (
      <ScrollView style={{ height: "100%" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          {loader}
          <View
            style={{
              marginTop: resizeHeight(130),
              alignSelf: "center",
              height: resizeHeight(480),
              width: resizeWidth(350),
              borderRadius: 30,
              backgroundColor: "#16267D",
              paddingTop: resizeHeight(70),
            }}
          >
            <Image
              style={styles.logo}
              source={
                this.state.setImage
                  ? { uri: this.state.image }
                  : require("../assets/person.png")
              }
            />

            <View style={styles.buttonText}>
              <AntDesign
                onPress={() => {
                  this.pickImage();
                }}
                style={{ alignSelf: "center" }}
                name="camera"
                size={24}
                color="white"
              />
            </View>

            <Text style={styles.labeluser}>NAME</Text>
            <TextInput
              style={styles.inputuser}
              placeholder="Please enter name"
              placeholderTextColor="#B1B3B3"
              onChangeText={this.onChangeTextName}
              value={this.state.name}
            />
            <Text style={styles.labeluser2}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.inputuser}
              placeholder="Please enter email"
              placeholderTextColor="#B1B3B3"
              onChangeText={this.onChangeTextEmail}
              value={this.state.email}
            />
            <Text style={styles.labeluser2}>PASSWORD</Text>
            <TextInput
              style={styles.inputuser}
              placeholder="Please enter password"
              placeholderTextColor="#B1B3B3"
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={this.onChangeTextPassword}
              value={this.state.password}
            />
          </View>

          <View style={{ alignSelf: "center", top: resizeHeight(-25) }}>
            <FlatButton text="SIGN UP" onPress={this.onPressCreate} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  logo: {
    top: resizeHeight(-70),
    width: resizeWidth(160),
    height: resizeHeight(160),
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "#16267D",
    position: "absolute",
    alignSelf: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    alignSelf: "center",
    backgroundColor: "#F7B600",
    width: resizeWidth(50),
    height: resizeHeight(50),
    borderRadius: 25,
    textAlign: "center",
    textAlignVertical: "center",
    top: resizeHeight(-30),
    left: resizeWidth(50),
    padding: 10,
  },

  labeluser: {
    fontWeight: "bold",
    marginLeft: resizeWidth(40),
    marginBottom: resizeHeight(5),
    fontSize: 16,
    color: "#FFFFFF",
  },

  labeluser2: {
    fontWeight: "bold",
    marginTop: resizeHeight(30),
    marginLeft: resizeWidth(30),
    marginBottom: resizeHeight(5),
    fontSize: 16,
    color: "#FFFFFF",
  },

  inputuser: {
    alignSelf: "center",
    paddingHorizontal: resizeWidth(15),
    width: resizeWidth(300),
    height: resizeHeight(50),
    borderColor: "#43519D",
    backgroundColor: "#283786",
    borderRadius: 8,
    color: "#F7B600",
  },
});
