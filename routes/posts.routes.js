const express = require("express");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();
const PostModel = require("../models/Post.model");
const UserModel = require("../models/User.model");

router.post("/create-post", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const idAuthor = req.currentUser._id;

    const newPost = await PostModel.create({ ...req.body, author: idAuthor });

    const author = await UserModel.findByIdAndUpdate(
      idAuthor,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    return res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.put(
  "/edit-post/:idPost",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const idAuthor = req.currentUser._id;
      const { idPost } = req.params;

      const editPost = await PostModel.findByIdAndUpdate(
        idPost,
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json(editPost);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

router.get("/all-posts", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const allPosts = await PostModel.find();

    return res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.delete(
  "/deleted-post/:idPost",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const idAuthor = req.currentUser._id;
      const { idPost } = req.params;

      const deletedPost = await PostModel.findByIdAndDelete(idPost);

      await UserModel.findByIdAndUpdate(deletedPost.author, {
        $pull: { posts: idPost },
      });

      return res.status(200).json(deletedPost);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
);

module.exports = router;
