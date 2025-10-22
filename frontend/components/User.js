import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserType } from "../UseContext";
import { useNavigation } from "@react-navigation/native";

const User = ({ item }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { userId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequest, setFriendRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/friendRequest/${userId}`
        );
        const data = await response.json(); // Await response.json()
        if (response.ok) {
          setFriendRequest(data);
        }
      } catch (error) {
        console.log("friends request not founded", error);
      }
    };
    fetchFriendRequest();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:8000/friend/${userId}`);
        const data = await response.json(); // Await response.json()
        if (response.ok) {
          setFriends(data);
        }
      } catch (error) {
        console.log("Friends not Founded", error);
      }
    };
    fetchFriends();
  }, []);

  const sentFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://localhost:8000/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("Error :", error);
    }
  };

  const reimage = (image) => {
    setSelectedImage((prevImage) => (prevImage === image ? null : image));
  };

  const renderImage = (image) => {
    if (image && image.trim() !== "") {
      const isImageEl = selectedImage === image;
      const imageSize = isImageEl ? 290 : 50;
      return (
        <TouchableOpacity onPress={() => reimage(image)}>
          <Image
            source={{ uri: image }}
            style={{ width: imageSize, height: imageSize, borderRadius: 15 }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 3,
        marginVertical: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {renderImage(item.image)}
        <View style={{ marginLeft: 12, paddingLeft: 8 }}>
          <Pressable onPress={() =>
        navigation.navigate("message", {
          recepiendId: item._id,
          
        },console.log("Clicked"))
      } >

          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
            {item.nick}
          </Text>
          </Pressable>
          {/* <Text style={{ fontSize: 11, color: "white" }}>{item.nick}</Text> */}
          <Text style={{ fontSize: 11, color: "white" }}>{item.name}</Text>
          {/* <Text style={{ fontSize: 11, color: "white" }}>{item.email}</Text> */}
        </View>
      </View>
      {friends.includes(item._id) ? (
        <Pressable
          style={{
            padding: 10,
            backgroundColor: "white",
            width: 100,
            borderRadius: 9,
            marginLeft: 290,
            position: "absolute",
          }}
        >
          <Text style={{ color: "black", padding: 2, marginTop: 5 }}>
            Friends
          </Text>
        </Pressable>
      ) : requestSent || friendRequest.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{
            backgroundColor: "red",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sentFriendRequest(userId, item._id)}
          style={{
            padding: 10,
            backgroundColor: "blue",
            width: 100,
            borderRadius: 9,
            marginLeft: 290,
            position: "absolute",
          }}
        >
          <Text style={{ color: "white", padding: 2, marginTop: 5 }}>
            Add Friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
