import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const bottomTabNavigator = createBottomTabNavigator(
  {
    LoginPage: {
      screen: Login,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="sign-in" size={25} color={tintColor} />
        ),
      },
    },
    Products: {
      screen: ProductListing,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={25} color={tintColor} />
        ),
      },
    },
    Chats: {
      screen: ChatList,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="commenting" size={25} color={tintColor} />
        ),
      },
    },
    Profile: {
      screen: ProfilePage,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="user" size={25} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: "LoginPage",
    tabBarOptions: {
      activeTintColor: "#1a1f71",
    },
  }
);

const AppContainer = createAppContainer(bottomTabNavigator);

// const Stack = createStackNavigator();

// function ChatListScreen() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="ProductListing" component={ProductListing} />
//       <Tab.Screen name="ChatList" component={ChatList} />
//       <Tab.Screen name="ProfilePage" component={ProfilePage} />
//     </Tab.Navigator>
//   );
// }

// function MyStack() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="ChatList" component={ChatListScreen} />
//         <Stack.Screen name="ProfilePage" component={ProfilePage} />
//         <Stack.Screen name="ProductListing" component={ProductListing} />
//         <Stack.Screen name="Signup" component={Signup} />
//         <Stack.Screen name="CreditCard" component={CreditCard} />
//         <Stack.Screen name="Chat" component={Chat} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <MyStack />
//     </NavigationContainer>
//   );
// }
