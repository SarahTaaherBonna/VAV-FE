import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Chat from "./components/Chat";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CreditCard from "./components/CreditCard";
import ProfilePage from "./components/ProfilePage";
import ChatList from "./components/ChatList";

// export default createStackNavigator({
//   Chat: { screen: Chat },
// });
console.disableYellowBox = true;

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ProfilePage" component={ProfilePage} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="CreditCard" component={CreditCard} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
