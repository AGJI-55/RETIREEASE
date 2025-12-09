const User = require("../models/user");
const Blog = require("../models/Blog");
const Discussion = require("../models/communityDiscussion");
const fs = require("fs");
const path = require("path");


module.exports.RenderSignup =  (req,res)=>{
    res.render("logs/signup.ejs");
}

module.exports.home = async (req,res)=>{
   const blogs = await Blog.find().sort({ likes: -1 }).limit(15);
   
    res.render("retires/index.ejs" ,{blogs});
}

// module.exports.health =  (req,res)=>{
//     res.render("retires/health.ejs");
// }

// module.exports.finance =  (req,res)=>{
//     res.render("retires/finance.ejs");
// }

// module.exports.community =  (req,res)=>{
//     res.render("retires/community.ejs");
// }

module.exports.Signup = async (req, res) => {
  try {
    console.log("SIGNUP POST HIT ✔", req.body);

    let { username, email, password, confirm } = req.body;


    if (password !== confirm) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username });
    const regUser = await User.register(newUser, password);
    console.log(regUser);

    // req.login(regUser, (err) => {
    //   if (err) {
    //     return next(err);
    //   }
      req.flash("success", "Welcome to RETIREASE");
      res.redirect("/");
    // });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.RenderLogin = (req,res)=>{
    res.render("logs/login.ejs");
  }
module.exports.Login = async(req , res)=>{
    req.flash("success" , "Welcome to RETIREASE..");
    let redirectkaUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectkaUrl);
  }  

module.exports.Logout = (req ,res)=>{
    req.logout((err) => {
      if(err){
        next(err);
      }
      req.flash('success' , "you are successfully logOut!..");
      res.redirect("/");
    })
  }    

  module.exports.myblogs = async(req,res,next)=>{
    const blogs = await Blog.find({owner:req.user._id});
    const discuss = await Discussion.find({owner:req.user._id});
    res.render("retires/myblog.ejs", { blogs  ,discuss});
  }
