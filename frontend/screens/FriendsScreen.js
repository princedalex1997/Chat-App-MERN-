import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import { UserType } from "../UseContext";
import FriendRequest from "../components/FriendRequest";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  const images = {
    uri: "https://cdn.pixabay.com/photo/2016/11/29/04/49/abstract-1867395_1280.jpg",
  };
  const images1 = {
    uri: "https://img.freepik.com/free-vector/flat-design-characters-chatting-dating-app_23-2148271380.jpg?size=626&ext=jpg",
  };

  useEffect(() => {
    fetchFriendRequest();
  }, []);

  const fetchFriendRequest = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/friend-request/${userId}`
      );
      if (response.status === 200) {
        const friendRequestData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
        setFriendRequests(friendRequestData);
      }
    } catch (error) {
      console.log("Error Message ", error);
    }
  };

  // console.log(friendRequests);
  return (
    <ImageBackground
      source={images}
      style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
    >
      {friendRequests.length == 0 ? (
        <ImageBackground
          source={images1}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={{ alignItems:'center',marginTop:'50%'}} >
            <Text style={{fontSize:30,fontWeight:600}} >No FriendRequestes !</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={{ height: "100%", padding: 10 }}>
          {friendRequests.length > 0 && <Text>You Have a Request !</Text>}

          {friendRequests.map((item, index) => (
            <FriendRequest
              key={index}
              item={item}
              friendRequests={friendRequests}
              setFriendRequests={setFriendRequests}
            />
          ))}
        </View>
      )}
    </ImageBackground>
  );
};

export default FriendsScreen;
