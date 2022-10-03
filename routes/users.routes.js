const express = require("express");
const router = express.Router();

const UserModel = require("../models/User.model");
const PostModel = require("../models/Post.model");
const ChatModel = require("../models/Chat.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    secure: false,
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

router.post("/sign-up", async (req, res) => {
  try {
    const { password, email } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#_!])[0-9a-zA-Z$*&@#_!]{8,}$/
      )
    ) {
      return res
        .status(400)
        .json({ message: "Senha não atende os requisitos de segurança" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    console.log(salt);

    const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);

    const newUser = await UserModel.create({
      ...req.body,
      passwordHash: passwordHash,
    });

    delete newUser._doc.passwordHash;

    const mailOptions = {
      from: "projectsbyAna@hotmail.com",
      to: email,
      subject: "Ativação de conta",
      html: `<p>Clique no link para ativar sua conta:<p> <a href=http://localhost:4000/users/activate-account/${newUser._id}>LINK</a>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, informe seu email e senha." });
    }

    const user = await UserModel.findOne({ email: email });
    console.log(user, "feito");

    if (!user) {
      return res.status(400).json({ message: "Usuário não cadastrado" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;

      const token = generateToken(user);

      return res.status(200).json({
        token: token,
        user: user,
      });
    } else {
      return res.status(400).json({ message: "Senha ou email incorretos" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    console.log(loggedInUser);

    const user = await UserModel.findById(loggedInUser._id, {
      passwordHash: 0,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/activate-account/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const user = await UserModel.findOne({ _id: idUser });

    if (!user) {
      return res.send("Erro na ativação da conta");
    }

    await UserModel.findByIdAndUpdate(idUser, {
      emailConfirm: true,
    });

    res.send(`<h1>Usuário ativado!!!!!!!</h1>`);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.put("/edit", isAuth, attachCurrentUser, async (req, res) => {
    try {
      const loggedInUser = req.currentUser;
      console.log(req.body);
  
      const editedUser = await UserModel.findByIdAndUpdate(
        loggedInUser._id,
        {
          ...req.body,
        },
        { new: true, runValidators: true }
      );
  
      delete editedUser._doc.passwordHash;
      console.log(editedUser);
      return res.status(200).json(editedUser);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  });

  // router.delete("/delete", isAuth, attachCurrentUser, async (req, res) => {
  //   try {

  //       const idUser = req.currentUser._id

  //       const deletedUser = await UserModel.findByIdAndDelete({idUser}, {$pull: {posts: posts, chats: chats} });
  //       delete deletedUser._doc.passwordHash;

  //       const postsFromUser = await PostModel.findOne({idUser});

  //       // postsFromUser.forEach( async (posts) => { 
  //       //     await PostModel.findByIdAndDelete(posts._id)
  //       // })

  //       const deletedPosts = await PostModel.deleteMany({ author: idUser });
        
  //       const chatsFromUser = await ChatModel.findOne(idUser);
        
  //       const deletedChats = await PostModel.deleteMany({ author: idUser });

  //       chatsFromUser.forEach( async (chats) => { 
  //         await PostModel.findByIdAndDelete(chats._id)
  //       })

        
  //   return res.status(200).json({
  //     deleteduser: deletedUser,
  //     postsFromUser: deletedPosts,
  //     chatsFromUser: deletedChats,
  //   })

  //   } catch (error) {
  //       console.log(error);
  //       return res.status(400).json(error);
  //   }
  // })

module.exports = router;
