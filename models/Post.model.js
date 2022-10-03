const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    content: { type: String, required: true, minlength: 2, maxlength: 300 },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    like: [{type: Schema.Types.ObjectId, ref: "User"}]
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;

// posts

content: "";
author: "idUser";
like: 0;
