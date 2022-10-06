const express = require("express");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();
const UserModel = require("../models/User.model");
const ChatModel = require("../models/Chat.model");

router.post(
  "/create-chat/:idUser",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const idAuthor = req.currentUser._id;
      const { idUser } = req.params;

      const oldChat = await ChatModel.find({
        $and: [
          {
            users: { $in: [idAuthor] },
          },
          {
            users: { $in: [idUser] },
          },
        ],
      });
      // console.log(oldChat);
      if (oldChat.length > 0) {
        return res.status(200).json({ oldChat: oldChat[0]._id });
      }

      const newChat = await ChatModel.create({ users: [idUser, idAuthor] });

      await UserModel.findByIdAndUpdate(idAuthor, {
        $push: { chats: newChat._id },
      });
      await UserModel.findByIdAndUpdate(idUser, {
        $push: { chats: newChat._id },
      });

      return res.status(201).json(newChat);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

router.post(
  "/send-message/:idConversa",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const idAuthor = req.currentUser._id;
      const { idConversa } = req.params;

      const message = { mensagem: req.body.mensagem, author: idAuthor };

      const chat = await ChatModel.findByIdAndUpdate(
        idConversa,
        {
          $push: { conversa: message },
        },
        { new: true }
      );

      return res.status(201).json(chat);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

router.get(
  "/messages/:idConversa",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idConversa } = req.params;

      const messages = await ChatModel.findById(idConversa)
      console.log("passou na rota")
      return res.status(200).json(messages);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

module.exports = router;
