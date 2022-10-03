
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./config/db.config");
dbConnection();
const app = express();


app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

const UsersRoute = require("./routes/users.routes");
app.use("/users", UsersRoute);

const PostsRoute = require("./routes/posts.routes")
app.use("/posts", PostsRoute)

const ChatsRoute = require("./routes/chats.routes")
app.use("/chat", ChatsRoute) 


app.listen(Number(process.env.PORT), () => {
  console.log("Server up and running on port 4000");
});
