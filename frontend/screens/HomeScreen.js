import { Pressable, ScrollView, StyleSheet, Text, View ,ImageBackground} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { UserType } from "../UseContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwt_decode from "jwt-decode";
import User from "../components/User";
import { Entypo } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const imagees = {
    uri: "https://img.freepik.com/free-vector/purple-neon-lined-pattern-dark-social-story-background-vector_53876-170438.jpg?w=740&t=st=1690889617~exp=1690890217~hmac=f1b7b5bd151f2c318911cd84de82d256420ffca6c521a6e4804aa8806dc4bde3",
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Swift Chat</Text>
        );
      },
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              style={{ color: "blue", marginRight: 10 }}
              onPress={() => navigation.navigate("Chats")}
            />
            <Ionicons
              onPress={() => navigation.navigate("friendsScreen")}
              name="md-people-sharp"
              size={24}
              color="black"
              style={{ color: "blue", marginRight: 5 }}
            />
            <Entypo name="plus" size={24} color="black"
            onPress={()=>navigation.navigate("trial")} />

          </View>
        );
      },
    });
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://localhost:8000/user/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((err) => {
          console.log("Error retrieving users", err.message);
        });
    };
    fetchUsers();
  }, []);
  //console.log("Users", users);
  return (
    <ImageBackground
      source={imagees}
      style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
    >
    <View style={{ height:"100%" }}>
      <ScrollView>
        <View>
          {users.map((item, index) => (
            <User key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
    </ImageBackground>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({});
