import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ChatList from "./components/ChatList";
import Login from "./components/Login";
import ProductListing from "./components/ProductListing";
import ProfilePage from "./components/ProfilePage";
import Signup from "./components/Signup";


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

function TabNavigator() {
  return (
    <Tab.Navigator>
       <Tab.Screen name="ProductListing" component={ProductListing} />
       <Tab.Screen name="ChatList" component={ChatList} />
       <Tab.Screen name="ProfilePage" component={ProfilePage} />
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>    
    </NavigationContainer>
  );
}
