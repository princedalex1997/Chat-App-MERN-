import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView, Pressable, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for Confirm Password
  const [image, setImage] = useState("");
  const [nick, setNick] = useState("");
  const [about, setAbout] = useState("");
  const [isOpen, setIsOpen] = useState("");
  const [gender, setGender] = useState("");
  const navigation = useNavigation();
  const imagees = {
    uri: "https://images.unsplash.com/photo-1527769929977-c341ee9f2033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxvZ2lufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  };

  const handleRegister = () => {
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match!");
      return;
    }

    if (!name || !email || !password || !confirmPassword || !nick || !about || !gender) {
      Alert.alert(
        "Incomplete Information",
        "Please fill in all required fields."
      );
      return;
    }
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
      nick: nick,
      gender:gender
    };

    //sent new user data to the backend
    axios
      .post("http://localhost:8000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration Successful",
          "You have been Registered Successfully. Then Go Back to Login Page"
        );
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword(""); // Clear Confirm Password state
        setImage("");
        setNick("");
        setAbout("");
        setGender("")
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          "An Error Occurred While Registering"
        );
        console.log("Registration Error", error);
      });
  };

  const genders = [
    {label:'Male', value:'1'},
    {label:'Female', value:'2'},
  ] 
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const handleGender = (selectgender) => {
    setGender(selectgender);
    setIsOpen(false);
  };

  return (
    <ImageBackground
      source={imagees}
      style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
    >
      <View style={styles.view}>
        <ScrollView>
          <KeyboardAvoidingView>
            <View style={styles.view1}>
              <Text style={styles.text}>Register</Text>
              <Text style={styles.text1}>Register To Your Account</Text>
            </View>
            <View style={styles.view3}>
              <View>
                <Text style={styles.Etext}>Name </Text>
                <TextInput
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Enter your name"
                  placeholderTextColor={"black"}
                  style={styles.textinput}
                />
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 600, color: "black" }}>
                  Nick Name
                </Text>
                <TextInput
                  value={nick}
                  onChangeText={(text) => setNick(text)}
                  placeholder="Nick Name"
                  placeholderTextColor={"black"}
                  style={styles.textinput}
                  autoCapitalize="none"
                />
              </View>
              {/* Gender */}
              <TouchableOpacity onPress={toggle} >
                <Text style={{fontSize:18,fontWeight:600, marginBottom:7}} >Gender  : {gender ? gender:"Choose"}</Text>
              </TouchableOpacity>
              {isOpen && (
                <View>
                 {genders.map((item)=>(
                 
                  <TouchableOpacity key={item.value} onPress={()=>handleGender(item.label)} >
                    <Text style={{fontSize:15,fontWeight:500}} >  {item.label}</Text>
                  </TouchableOpacity>
                 ))}
                </View>
              )}
              {/* Gender */}
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

              <View>
                <Text style={styles.Ptext}> Password </Text>
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Enter your password"
                  placeholderTextColor={"black"}
                  style={styles.textinput}
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </View>
              {/* New Confirm Password TextInput */}
              <View>
                <Text style={styles.Ptext}> Confirm Password </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  placeholder="Re-enter your password"
                  placeholderTextColor={"black"}
                  style={styles.textinput}
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </View>
              <View>
                <Text style={styles.Ptext}> About Me </Text>
                <TextInput
                  value={about}
                  onChangeText={(text) => setAbout(text)}
                  placeholder="About you!"
                  placeholderTextColor={"black"}
                  style={styles.textinput}
                  autoCapitalize="none"
                />
              </View>
              <View>
                <Text style={styles.Etext}> Image </Text>
                <TextInput
                  value={image}
                  onChangeText={(text) => setImage(text)}
                  placeholder="Image"
                  placeholderTextColor={"black"}
                  style={styles.textinput}
                />
              </View>
              <Pressable style={styles.prss} onPress={handleRegister}>
                <Text style={styles.prsstext}>Register</Text>
              </Pressable>

              <View
                style={{
                  flexDirection: "row",
                  textAlign: "center",
                  color: "gray",
                  fontSize: 18,
                  padding: 20,
                }}
              >
                <Text>Already Have an Account ?</Text>
                <Pressable onPress={() => navigation.goBack()}>
                  <Text
                    style={{
                      fontSize: 19,
                      marginTop: -4,
                      fontWeight: "bold",
                      color: "red",
                      marginLeft: 4,
                    }}
                  >
                    Go Back
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 10,
    alignItems: "center",
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
    color: "yellow",
    fontSize: 17,
    fontWeight: 600,
  },
  text1: {
    color: "yellow",
    fontSize: 17,
    fontWeight: 600,
    marginTop: 15,
  },
  textinput: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 300,
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
    marginTop: 20,
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
