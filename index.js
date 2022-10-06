
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./config/db.config");
dbConnection();
const app = express();


app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URI }));

const UsersRoute = require("./routes/users.routes");
app.use("/users", UsersRoute);

const PostsRoute = require("./routes/posts.routes")
app.use("/posts", PostsRoute)

const ChatsRoute = require("./routes/chats.routes")
app.use("/chat", ChatsRoute) 

const UpImgRoute = require("./routes/uploading.routes");
app.use("/", UpImgRoute);

app.listen(Number(process.env.PORT), () => {
  console.log("Server up and running on port 4000");
});
