const express = require("express");
const router = express.Router();

const UserModel = require("../models/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    user: "projectsbyAna@hotmail.com",
    pass: "projectsAna343",
  },
});



router.post("/sign-up", async (req, res) => {
    try {
      //pegando a senha do body
      const { password, email } = req.body;
  
      //checando se a senha existe e se ela passou na RegEx
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
  
      //envio de email
      const mailOptions = {
        from: "projectsbyAna@hotmail.com",
        to: email,
        subject: "Ativação de conta",
        html: `<p>Clique no link para ativar sua conta:<p> <a href=http://localhost:4000/users/activate-account/${newUser._id}>LINK</a>`,
      };
  
      // Dispara e-mail para o usuário
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

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Por favor, informe seu email e senha." });
      }
  
      const user = await UserModel.findOne({ email: email });

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
      })
 
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  });

module.exports = router;
