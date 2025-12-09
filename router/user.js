const express = require("express");
const { mongo, default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const userController = require("../controller/users.js")
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");

router.route("/signup")
.get(userController.RenderSignup)
.post( userController.Signup);

router.route("/login")
.get(userController.RenderLogin )
.post(  passport.authenticate("local" , {failureRedirect: "/login" ,
   failureFlash: true}), userController.Login)

   
router.get("/logout" , userController.Logout)

router.route("/").get(userController.home);

router.route("/myblogs").get(isLoggedIn, userController.myblogs);

// router.route("/health").get(userController.health);
// router.route("/finance").get(userController.finance);
// router.route("/community").get(userController.community);

module.exports = router;