import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UseContext";
import UserChat from "../components/UserChat";

const ChatScreen = () => {
  const [acceptFriends, setAcceptFriends] = useState([]);
  const { userId } = useContext(UserType);

  useEffect(() => {
    const fetchAcceptedFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/accepted-friends/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setAcceptFriends(data);
          console.log("Data is fetched successfully");
        }
      } catch (error) {
        console.log("Data Not Fetch ", error);
      }
    };

    fetchAcceptedFriends(); 
  }, [userId]); 
  // console.log(acceptFriends); 

  const imagees = {
    uri: "https://images.pexels.com/photos/4197491/pexels-photo-4197491.jpeg?auto=compress&cs=tinysrgb&w=1600",
  };

  return (
    <ImageBackground
      source={imagees}
      style={{ flex: 1, resizeMode: "cover" }}
    >
      <ScrollView>
        {acceptFriends.map((item , index) =>(
          <UserChat key={index} item={item}/>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
