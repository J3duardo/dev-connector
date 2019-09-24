const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

//Crear posts
router.post("/",
  [
    auth,
    check("text", "Text is required").not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      })
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = {
        text: req.body.text,
        name: req.body.name || user.name,
        avatar: user.avatar,
        user: req.user.id
      }

      const post = await Post.create(newPost);
      res.json(post);
      
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error")
    }
  }
);

//Obtener todos los posts
router.get("/", auth, async (req, res) => {
  try {
    //Obtener los posts y ordenarlos desde el más reciente
    const posts = await Post.find().sort({date: -1});
    res.json(posts);
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error")
  }
});

//Obtener un post por su ID
router.get("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if(!post) {
      return res.status(404).json({msg: "Post not found"})
    }

    res.json(post);
    
  } catch (error) {
    console.log(error.message);
    if(error.kind === "ObjectId") {
      return res.status(404).json({msg: "Post not found"})
    }
    res.status(500).send("Server error")
  }
});

module.exports = router;