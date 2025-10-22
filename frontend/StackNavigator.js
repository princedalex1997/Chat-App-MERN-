import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatScreen from "./screens/ChatScreen";
import ChatMessage from "./screens/ChatMessage";
import Trial from "./screens/Trial";


const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerStyle:{
          backgroundColor:'lightyellow'
        }}}  />
        <Stack.Screen name="friendsScreen" component={FriendsScreen} options={{headerStyle:{
          backgroundColor:'#92a8d1'
        }}} />
        <Stack.Screen name="Chats" component={ChatScreen} options={{headerStyle:{
          backgroundColor:'#92a8d1'
        }}} />
        <Stack.Screen name="message" component={ChatMessage} options={{headerStyle:{
          backgroundColor:'#92a8d1'
        }}} />
        <Stack.Screen name="trial" component={Trial} options={{headerStyle:{
          backgroundColor:'#92a8d1'
        }}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
