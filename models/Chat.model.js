const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }], //"idUser", "idUser" /
    conversa: [
      {
        mensagem: "",
        author: { type: Schema.Types.ObjectId, ref: "User" },
        hora: {type: Date, default: Date.now},
      },
    ], //Date.now() => hora / author => referencia user / mensagem type String, minlength: 2
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;
