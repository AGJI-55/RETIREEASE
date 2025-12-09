if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./router/user");
const healthRouter = require("./router/health.js");
const financeRouter = require("./router/finance.js");
const communityRouter = require("./router/community.js");
const session = require("express-session");

const dburl = process.env.DB_URL;

main().then(()=>{
    console.log("connection success");
}).catch(err => console.log(err));
async function main(){
    await mongoose.connect(dburl);

    // use async await url==
}



app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use('/Posts', express.static(__dirname + '/Posts'));





const sesopt = {
    secret: process.env.SECRET,
    resave: false ,
     saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 *1000 ,
        maxAge: 7 * 24 * 60 * 60 *1000 ,
        httpOnly : true,
    },
    };



app.use(session(sesopt));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/" , userRouter);
app.use("/health" , healthRouter);
app.use("/finance" , financeRouter);
app.use("/community" , communityRouter);



// app.get("/",(req,res)=>{
//         // res.send("Home page");
//         res.render("retires/index.ejs");
//     });  

// app.get("/login",(req,res)=>{
//         // res.send("Home page");
//         res.render("logs/login.ejs");
//     });  



app.listen(8090,()=>{
    console.log("server is listening to port 8090");
});

// const { bookCancel } = require("./controller/scheduler.js");
// bookCancel();
