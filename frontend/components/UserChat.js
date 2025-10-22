import { View, Text, Pressable, Image } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UseContext";

const UserChat = ({ item }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const { userId, setUser } = useContext(UserType);
  const fetchMessage = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/messages/${userId}/${item._id}`
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        console.log(response.status.message);
      }
    } catch (error) {
      console.log("Not Fetched", error);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);
  console.log(lastmessage);

  const getLastmessage = () => {
    const usermessage = messages.filter(
      (message) => message.messageType === "text"
    );
    const last = usermessage.length;
    return usermessage[last-1];
  };

  const lastmessage = getLastmessage();

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("message", {
          recepiendId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "black",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item?.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "700" }}>{item.name}</Text>
        {lastmessage && (
           <Text style={{ marginTop: 5,marginLeft:5, color: "blue", fontWeight: "300" }}>
           {lastmessage.message}
         </Text>
        )}
       
      </View>
      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastmessage && formatTime(lastmessage.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;
