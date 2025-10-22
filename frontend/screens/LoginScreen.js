import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import  Animated, { FadeInUp, FadeOut,FadeInRight,StretchInY } from 'react-native-reanimated';
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const imagees = {
uri:"https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=1600"  };

  
  //  useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("authToken");
  //       if (token) {
  //         navigation.replace("Home");
  //       }
  //     } catch (error) {
  //       console.log("Error", error);
  //     }
  //   };
  //   checkLoginStatus();
  // }, []);
  

  //Login Press
  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:8000/login", user)
      .then((response) => {
        //console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.replace("Home");
      })
      .catch((error) => {
        Alert.alert("Login Error");

        console.log("Error Login ", error);
      });
  };
  return (
    <ImageBackground
      source={imagees}
      style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
    >
      <View style={styles.view}>
        <KeyboardAvoidingView>
          <View style={styles.view1}>
            <Animated.Text
             entering={FadeInUp.delay(200).duration(1000).springify().damping(3)}
            >

            <Text style={styles.text}>Login</Text>
            </Animated.Text>
            <Animated.Text
             entering={FadeInUp.delay(300).duration(1000).springify().damping(3)}
            >
            <Text style={styles.text1}>Sign in To Your Account</Text>
            </Animated.Text>
          </View>
          <View style={styles.view3}>
            <Animated.View entering={FadeInRight.delay(300).duration(1200).springify().damping(3)}>
            <View>
              <Text style={styles.Etext}> Email </Text>
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Enter your email"
                placeholderTextColor={"black"}
                style={styles.textinput}
                autoCapitalize="none"
              />
            </View>
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(300).duration(1200).springify().damping(3)}>
            <View style={{paddingTop:30}} >
              <Text style={styles.Ptext}>Password</Text>
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={false}
                placeholder="Enter your password"
                placeholderTextColor={"black"}
                style={styles.textinput}
                autoCapitalize="none"
              />
            </View>
            </Animated.View>
            <Pressable style={styles.prss} onPress={handleLogin}>
              <Animated.Text entering={StretchInY.delay(300).duration(1200).springify().damping(2)} >
              <Text style={styles.prsstext}>Login</Text>
              </Animated.Text>
            </Pressable>
            <Animated.View entering={FadeInUp.delay(300).duration(1200).springify().damping(2)} >
            <View
              style={{
                flexDirection: "row",
                textAlign: "center",
                color: "gray",
                fontSize: 18,
                padding: 15,
                paddingLeft: 35,
              }}
            >
              <Text>Do You Have an Account ?</Text>
              <Pressable
                style={{}}
                onPress={() => navigation.navigate("Register")}
              >
                <Text
                  style={{
                    color: "white",
                    marginLeft: 6,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  view: {
    flex: 1,

    padding: 10,
    alignItems: "center",
    paddingTop:90
  },
  view1: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  view3: {
    marginTop: 50,
  },
  text: {
    color: "white",
    fontSize: 57,
    fontWeight: 600,
  },
  text1: {
    color: "#4A55A2",
    fontSize: 17,
    fontWeight: 600,
    marginTop: 15,
  },
  textinput: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 300,
    fontSize: 18,
  },
  Etext: {
    fontSize: 18,
    fontWeight: 600,
    color: "black",
  },
  Ptext: {
    fontSize: 18,
    fontWeight: 600,
    color: "black",
  },
  prss: {
    width: 200,
    backgroundColor: "#4A55A2",
    padding: 15,
    marginTop: 70,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 6,
  },
  prsstext: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});
