
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = ( req , res , next) => {
    // console.log( req.path  , "hgf", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in !!!");
        return res.redirect("/login");
    }
    next();
}