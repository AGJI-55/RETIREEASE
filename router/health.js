const healthController = require("../controller/health.js");
const express = require("express");
const { mongo, default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const {isLoggedIn  } = require("../middleware.js");

const multer = require("multer");
const record = require("../models/record.js");
// const {storage} =require("../cloudConfig.js");
// const upload = multer({storage});
const path = require("path");
const fs = require("fs");
const { route } = require("./user.js");
const upload = multer({ dest: path.join(__dirname, "..", "uploads") });



router.route("/").get(  healthController.health);

router.route("/medi").get(  healthController.medi);

router.route("/booking").post( isLoggedIn, healthController.book);

router.route("/booking/:id").delete(isLoggedIn, healthController.DestroyBook);

router.route("/record").post(isLoggedIn , upload.single('recordFile'), healthController.recordDone);

router.route("/record/:id").delete(isLoggedIn, healthController.DestroyRecord);

router.route("/medication").post(isLoggedIn , healthController.addMedication);

router.route("/medication/:id").delete(isLoggedIn , healthController.DestroyMed);

router.route("/sleep").post(isLoggedIn , healthController.addSleep);

router.route("/addCare").post(isLoggedIn , healthController.addCare);
router.route("/addCare/:id").delete(isLoggedIn,healthController.destroyCare);

router.route("/SOS").post(isLoggedIn , healthController.SOSalert);

module.exports = router;