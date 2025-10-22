import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UseContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const acceptRequest = async (friendRequestId) => {
    try {
      const response = await fetch(
        "http://localhost:8000/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderID: friendRequestId,
            recepiendId: userId,
          }),
        }
      );
      
      if (response.ok) {
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats")
      }
    } catch (error) {
      console.log("Error in Accepect Friend", error);
    }
  };
  return (
    <Pressable>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: 50, height: 50, borderRadius: 6 }}
        />
        <Text>{item?.name} sent You a friend request </Text>
      </View>
      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={{ backgroundColor: "blue", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
