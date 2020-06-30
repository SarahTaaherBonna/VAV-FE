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
  Alert,
} from "react-native";
import Loader from "../components/Loader";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const resizeWidth = (w) => {
  return (value = w * (windowWidth / 375));
};

const resizeHeight = (h) => {
  return (value = h * (windowHeight / 872));
};

import firebaseSDK from "../config/firebaseSDK";

export default class ProfilePage extends React.Component {
  state = {
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    image: "",
    uid: firebaseSDK.uid,
    setImage: false,
    updateImage: false,
    loading: false,
  };

  constructor(props) {
    super(props);
    this.onPressUpdate = this.onPressUpdate.bind(this);
  }

  async componentDidMount() {
    var dataObtainedFromFirebase = await firebaseSDK.getAccountDetails();
    var username = dataObtainedFromFirebase.split(",")[0];
    var userEmail = dataObtainedFromFirebase.split(",")[1];
    this.setState({ name: username });
    this.setState({ email: userEmail });
    console.log("-------------------IN PROFILE PAGE---------------");
    let imgAvatar = await firebaseSDK.getAvatar();
    if (imgAvatar) {
      this.setState({ image: imgAvatar, setImage: true });
    }
  }

  onPressUpdate = async () => {
    try {
      this.setState({ loading: true });
      console.log(this.state.name);
      console.log(this.state.email);
      console.log(this.state.currentPassword)
      console.log(this.state.newPassword)
      console.log(this.state.uid);

      if (this.state.name !== firebaseSDK.displayName) {
        await firebaseSDK.updateName(this.state.name);
      }

      if (this.state.email !== firebaseSDK.email) {
        await firebaseSDK.updateEmail(this.state.email);
        await firebaseSDK.loginWithoutCallback(this.state.email, this.state.currentPassword)
      }

      if (this.state.newPassword) {
        await firebaseSDK.updatePassword(this.state.password)
      }

      this.setState({ loading: false });
      Alert.alert("Profile updated successfully!");
      // this.props.navigation.navigate("Home", {
      //   screen: "ProductListing",
      // });
    } catch ({ message }) {
      console.log("Update account failed. Catch error: " + message);
      this.setState({ loading: false });
      Alert.alert("Profile Update failed. Please try again.");
    }
  };

  onChangeTextEmail = (email) => this.setState({ email });
  onChangeTextCurrentPassword = (currentPassword) => this.setState({currentPassword});
  onChangeTextNewPassword = (newPassword) => this.setState({newPassword})
  onChangeTextName = (name) => this.setState({ name });

  async pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri, setImage: true, updateImage: true });
    }
  }

  render() {
    if (this.state.loading) {
      var loader = <Loader />;
    }
    return (
      <ScrollView style={{ maxHeight: "100%" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          {loader}
          <View
            style={{
              marginTop: resizeHeight(90),
              alignSelf: "center",
              height: resizeHeight(560),
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
              pplaceholderTextColor="#B1B3B3"
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
            <Text style={styles.labeluser2}>CURRENT PASSWORD</Text>
            <TextInput
              style={styles.inputuser}
              placeholder="Required for email/password change"
              placeholderTextColor="#B1B3B3"
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={this.onChangeTextCurrentPassword}
            />
            <Text style={styles.labeluser2}>NEW PASSWORD</Text>
            <TextInput
              style={styles.inputuser}
              placeholder="Leave blank if no change"
              placeholderTextColor="#B1B3B3"
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={this.onChangeTextNewPassword}
            />
          </View>

          <View style={{ alignSelf: "center", top: resizeHeight(-25) }}>
            <FlatButton
              text="UPDATE"
              onPress={() => {
                this.onPressUpdate();
              }}
            />
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
    top: -30,
    left: 50,
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
