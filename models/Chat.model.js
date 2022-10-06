const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    conversa: [
      {
        mensagem: "",
        author: { type: Schema.Types.ObjectId, ref: "User" },
        hora: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;
