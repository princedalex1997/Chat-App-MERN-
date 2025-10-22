import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Entypo } from "@expo/vector-icons";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UseContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const ChatMessage = () => {
  const [emojiselecter, setEmojiselector] = useState(false);
  const [selectImage, setSelectImage] = useState("");
  const [message, setMessage] = useState("");
  const [recepiendData, setRecepiendData] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [selectMessages, setSelectMessages] = useState([]);
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const { recepiendId } = route.params;
  const scrl = useRef(false)

  const handleEmoji = () => {
    setEmojiselector(!emojiselecter);
  };

  const fetchMessage = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/messages/${userId}/${recepiendId}`
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

  useEffect(() => {
    const fetchRecepiendData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/user1/${recepiendId}`
        );
        const data = await response.json();
        setRecepiendData(data);
      } catch (error) {
        console.log("Data Not Fetched", error);
      }
    };
    fetchRecepiendData();
  }, []);
  console.log(selectMessages);

  // In the handleSend function
  const handleSend = async (messageType, imageUrl) => {
    try {
      if(messageType === "text" && !message.trim()){
        Alert.alert("Enter message")
        return;
      }
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepiendId);

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUrl,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      const response = await fetch("http://localhost:8000/message", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setMessage("");
        setSelectImage("");
        fetchMessage();
      }
    } catch (error) {
      console.log("Failed to send message:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-back"
            size={24}
            color="black"
          />
          {selectMessages.length > 0 ? (
            <Text>{selectMessages.length}</Text>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  width: 44,
                  height: 44,
                  resizeMode: "cover",
                  borderRadius: 15,
                }}
                source={{ uri: recepiendData.image }}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginTop: 10,
                  marginLeft: 6,
                }}
              >
                {recepiendData.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectMessages.length > 0 ? (
          <MaterialCommunityIcons
            onPress={() => deleteMessage(selectMessages)}
            name="delete-forever"
            size={24}
            color="black"
          />
        ) : null,
    });
  }, [recepiendData, selectMessages]);

  const deleteMessage = async (messagesid) => {
    try {
      const response = await fetch("http://localhost:8000/deleteMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messagesid }),
      });
      if (response.ok) {
        setSelectMessages((prev) =>
          prev.filter((id) => !messagesid.includes(id))
        );
        fetchMessage();
        Alert.alert("Message Deleted");
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      handleSend("image", result.uri);
    }
  };

  const handleSelectMessage = (message) => {
    const isSelected = selectMessages.includes(message._id);

    if (isSelected) {
      setSelectMessages((previousmessage) =>
        previousmessage.filter((id) => id !== message._id)
      );
    } else {
      setSelectMessages((previousmessage) => [...previousmessage, message._id]);
    }
  };

  const scrlMain = () => {
    if(scrl.current){
      scrl.current.scrollToEnd({animated:false})
    }
  }
  useEffect(()=>{
    scrlMain();
  },[])

  const handleScroll = ()=> {
    scrlMain();
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "lightblue" }}>
      <ScrollView
        ref={scrl}
        contentContainerStyle={{flexGrow:1}}
        onContentSizeChange={handleScroll}
      >
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectMessages.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index} // Add a unique key for each item
                style={[
                  item.senderId._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                  isSelected && { width: "100%", backgroundColor: "#abc2b1" },
                ]}
              >
                <Text>{item.message}</Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const BaseUrl = "/Users/admin/chatproject/api/file/";
            const imageUrl = item.imageUrl;
            const filename = imageUrl.split("/").pop();
            const source = { uri: BaseUrl + filename };
            return (
              <Pressable
                key={index} // Add a unique key for each item
                style={[
                  item.senderId._id === userId
                    ? {
                        alignSelf: "flex-end",
                        // backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        // backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                ]}
              >
                <View>
                  <Image
                    source={source}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "black",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 0,
          //   borderTopColor: "black",
          marginBottom: emojiselecter ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmoji}
          name="emoji-happy"
          size={24}
          color="gray"
          style={{ marginLeft: 2 }}
        />
        <TextInput
          placeholder="Enter your message...."
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 20,
            paddingHorizontal: 20,
            height: 40,
            marginLeft: 5,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 10,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <FontAwesome name="microphone" size={24} color="gray" onLongPress={()=>console.log("Voice is activated")} />
        </View>

        <TouchableOpacity
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: "blue",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            marginLeft: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
      {emojiselecter && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage(message + emoji);
          }}
          style={{ height: 350 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessage;
