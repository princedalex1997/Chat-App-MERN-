const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalStrategy = passportLocal.Strategy;
const multer = require("multer");

const app = express();
const port = process.env.REACT_API_API_PORT || 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");
require("dotenv").config();


const User = require("./models/user");
const Message = require("./models/message");

const api = process.env.REACT_API_KEY_API;

mongoose
  .connect(
    api,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to Backend");
  })
  .catch(() => {
    console.log("Error Connecting to Backend");
  });

app.listen(port, () => {
  console.log(`Server is Running Port :${port}`);
});

//********---------Main-------**************

//Point Of Registeration of the User

app.post("/register", (req, res) => {
  const { name, email, password, nick, about, image ,gender} = req.body;

  // create  a new User Object
  const newUser = new User({ name, email, password, nick, about, image, gender });

  //save the user to the databse
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User Registered Successfully" });
    })
    .catch((err) => {
      console.log("Error Registeration", err);
      res.status(500).json({ message: "Error User Register " });
    });
});

//Function Create token To ID

const createToken = (userId) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });
  return token;
};

//Point Logging to the user

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //checking email and password to the previews
  if (!email || !password) {
    return res.status(403).json({ message: "Email and Password are Required" });
  }
  //check User in Database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User Is Not Found" });
      }
      if (user.password !== password) {
        return res.status(405).json({ message: "Invalid Password" });
      }
      //create a Token for each _ID
      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.log("Error Finding User", error);
      res.status(500).json({ message: "Server Login Message !" });
    });
});

//show the other login people

app.get("/user/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;

  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(203).json(users);
    })
    .catch((error) => {
      console.log("Error Of Logging User", error);
      res.status(500).json({ message: "Error Running Service" });
    });
});

//Friend Request sending

app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    //Requested to Friend
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    //Receving Requser Person
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(501);
  }
});
//seen the sent friendRequest
app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)

      .populate("friendRequests", "name email image")
      .lean();

    const friendRequests = user.friendRequests;

    res.json(friendRequests);
  } catch (error) {
    console.log(error);
    res.status(502).json({ message: "Invalid Server Error" });
  }
});

//accept the friend Request
app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderID, recepiendId } = req.body; // Corrected variable names

    const sender = await User.findById(senderID);
    const recepient = await User.findById(recepiendId);

    sender.friends.push(recepiendId);
    recepient.friends.push(senderID);

    // when we clicked in the Accept. friendRequests id name is removed
    recepient.friendRequests = recepient.friendRequests.filter(
      (request) => request.toString() !== senderID.toString()
    );
    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepiendId.toString() // Corrected variable name
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend Request Accepted Successfully" });
  } catch (error) {
    console.log("Error in Friends Accepted :", error);
    res.status(500).json({ message: "Invalid Friends Accepted" });
  }
});

app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// sent message to

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "file/");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/message", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body; // Use req.body to access parameters

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null, // Save the imageUrl or null if no image
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get userDeatlis
app.get("/user1/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // fetch the data
    const recepiendId = await User.findById(userId);
    res.json(recepiendId);
  } catch (error) {
    console.log(error, "Not Founded");
    res.status(404).json({ message: "Not Founded" });
  }
});

//get the messages
app.get("/messages/:senderId/:recepiendId", async (req, res) => {
  try {
    const { senderId, recepiendId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepiendId },
        { senderId: recepiendId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "not found" });
  }
});

//delete message
app.post("/deleteMessage", async (req, res) => {
  try {
    const { message } = req.body;
    await Message.deleteMany({ _id: { $in: message } });
  } catch (error) {
    console.log("Not Found", error);
    res.status(404).json({ message: "not Valied" });
  }
});

// show the friendRequest
app.get("/friendRquest/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequests", "name email image")
      .lean();
    const sentFriendRequests = user.sentFriendRequests;
    res.json(sentFriendRequests);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Not Founded" });
  }
});

app.get("/friend/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    User.findById(userId)
      .populate("friends")
      .then((user) => {
        if (!user) {
          
          res.status(405).json({ message: "No Friends Founded" });
        }
        const friendsId = user.friends.map((friend) => friend._id);

        res.status(202).json(friendsId);
      });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Not Founded" });
  }
});
