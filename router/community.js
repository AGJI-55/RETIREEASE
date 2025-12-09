const CommunityController = require("../controller/community");
const express = require("express");
const { mongo, default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const {isLoggedIn  } = require("../middleware.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { route } = require("./user.js");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "Posts"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);   //  .jpg / .png
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + ext);   // Save WITH extension
  }
});

const upload = multer({ storage: storage });
// const upload = multer({ dest: path.join(__dirname, "..", "Posts") });



router.route("/").get( CommunityController.community);
router.route("/blogPost").post(isLoggedIn , CommunityController.addDiscussion);

router.route("/Blog").post(isLoggedIn , upload.single('image'), CommunityController.addBlog);

router.route("/blogPost/:id/likes").post( CommunityController.likeCount);
router.route("/Blog/:id/likes").post( CommunityController.likebCount);

router.route("/search").get(CommunityController.search);
router.route("/dis/:id").get(CommunityController.ShowDis);
router.route("/bl/:id").get(CommunityController.ShowBlog);
router.route("/bl/:id/edit").get(CommunityController.Editbl);
router.route("/dis/:id/edit").get(CommunityController.Editdis);
router.route("/dis/:id").delete( isLoggedIn, CommunityController.DelDis);
router.route("/bl/:id").delete(isLoggedIn,CommunityController.DelBlog);

router.route("/dis/:id").put(isLoggedIn, upload.single("image"), CommunityController.updatedis);
router.route("/bl/:id").put(isLoggedIn,  upload.single("image"), CommunityController.updatebl);

module.exports = router;