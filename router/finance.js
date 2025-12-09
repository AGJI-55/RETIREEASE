const financeController = require("../controller/finance");
const express = require("express");
const { mongo, default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const {isLoggedIn  } = require("../middleware.js");

router.route("/").get( financeController.finance);

router.route("/budget").post(isLoggedIn , financeController.addBudget);

router.route("/budget").delete(isLoggedIn , financeController.ClearAll);


router.route("/budget/:id").delete(isLoggedIn , financeController.DestroyBud);

module.exports = router;