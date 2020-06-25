import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ChatList from "./components/ChatList";
import Login from "./components/Login";
import ProductListing from "./components/ProductListing";
import ProfilePage from "./components/ProfilePage";
import Signup from "./components/Signup";
import CreditCard from "./components/CreditCard";
<<<<<<< Updated upstream
import Logout from "./components/Logout";
=======
import Chat from "./components/Chat"
>>>>>>> Stashed changes

console.disableYellowBox = true;

function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

function SignupStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Sign Up" component={Signup} />
    </Stack.Navigator>
  );
}

function CreditCardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Add Credit Card Details" component={CreditCard} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={ChatList} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Products") {
            iconName = "ios-home";
          } else if (route.name === "Chats") {
            iconName = "ios-chatbubbles";
          } else if (route.name === "Profile") {
            iconName = "md-person";
          } else if (route.name === "Logout") {
            iconName = "ios-log-out";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "gray",
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen name="Products" component={ProductListing} />
      <Tab.Screen name="Chats" component={ChatStack} />
      <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginStack} />
        <Stack.Screen name="Sign Up" component={SignupStack} />
        <Stack.Screen name="Add Credit Card Details" component={CreditCard} />
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
