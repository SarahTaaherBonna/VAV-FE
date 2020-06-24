import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

import Chat from "./components/Chat";
import ChatList from "./components/ChatList";
import CreditCard from "./components/CreditCard";
import Login from "./components/Login";
import ProductListing from "./components/ProductListing";
import ProfilePage from "./components/ProfilePage";
import Signup from "./components/Signup";
import { render } from "react-dom";

// export default createStackNavigator({
//   Chat: { screen: Chat },
// });
console.disableYellowBox = true;

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
       <Tab.Screen name="ProductListing" component={ProductListing} />
       <Tab.Screen name="ChatList" component={ChatList} />
       <Tab.Screen name="ProfilePage" component={ProfilePage} />
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="ProductListing" component={BottomTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
