const Booking = require("../models/booking");
const Medication = require("../models/med");
const Sleep = require("../models/sleep");
const Caregiver = require("../models/addCare");
const record = require("../models/record");
const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const cron = require("node-cron");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

module.exports.health = async (req,res)=>{
    let bookings = [];
    let records = [];
    let meds = [];
    let sleeps = [];
    let caregivers = [];
    let avg7 = "—";

  if (req.user) {
    bookings = await Booking.find({ owner: req.user._id });
    records = await record.find({ owner: req.user._id });
    meds = await Medication.find({owner: req.user._id});
    sleeps = await Sleep.find({ owner: req.user._id })
    .sort({ sleepDate: -1 })    
    .limit(7);

    caregivers = await Caregiver.find({owner: req.user._id});
    
   if (sleeps.length) {
         let sum = 0;

        sleeps.forEach(s => {
              sum += Number(s.hours);
        });

       avg7 = (sum / sleeps.length).toFixed(1);
    }
  }
// const bookings  = await Booking.find({ owner : req.user._id });
 
    res.render("retires/health.ejs" ,{bookings ,records,meds , sleeps , avg7 , caregivers});
}

module.exports.medi = async(req,res,next)=>{
  res.render("retires/medi.ejs");
}

module.exports.book = async (req,res , next)=>{

  const selectedDate = new Date(req.body.datetime);
    const now = new Date();

    // ❌ Reject past date/time
    if (selectedDate <= now) {
      req.flash("error", "Booking time must be in the future!");
      return res.redirect("/health");
    }

  const newBooking = new Booking({
      name: req.body.name,
    datetime: new Date(req.body.datetime),
      type: req.body.type
    });

    // Assign logged-in user
    newBooking.owner = req.user._id;
   
  const user = await User.findById(req.user._id);
  await newBooking.save(); 

    schedule.scheduleJob(newBooking.datetime, async () => {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Your RetireEase Booking Reminder",
            text: `Your ${newBooking.type} session is starting now!`
          });
    
          console.log("📨 Email sent ");
        } catch (err) {
          console.log("❌ Email ERROR:", err);
        }
      });

    const deleteAt = new Date(newBooking.datetime.getTime() + 24 * 60 * 60 * 1000);
    // const deleteAt = new Date(newBooking.datetime.getTime()+1000);

    schedule.scheduleJob(deleteAt, async () => {
      try {
        // double-check it still exists before deleting
        const exists = await Booking.findById(newBooking._id);
        if (exists) {
          await Booking.findByIdAndDelete(newBooking._id);
          console.log("🗑 Auto-deleted booking (24h after):", newBooking.name);
        }
      } catch (err) {
        console.log("❌ Auto-delete ERROR:", err);
      }
    });  

    req.flash("success", "New booking created successfully!");
    res.redirect("/health");
}

module.exports.DestroyBook = async (req,res)=>{
    let {id} = req.params;
    let delList =  await  Booking.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success", "Booking Cancelled!");
  res.redirect("/health");
}

module.exports.recordDone = async (req ,res , next) => {

    if (!req.file) {
    req.flash("error", "File not received");
    return res.redirect("/health");
  }

    let url  = req.file.path ; 
  let filename = req.file.filename;

    const newRecord = new record({
    title : req.body.recordTitle,
   });
    newRecord.owner = req.user._id;
  newRecord.image = {url , filename};

  await newRecord.save();
   req.flash("success", "New record uploaded !");
  res.redirect("/health");
}

module.exports.addMedication = async (req, res, next) => {
  try {
    const { medName, medTime } = req.body;  // medTime = "HH:MM"

    // Split time (string)
    const [hours, minutes] = medTime.split(":");

    // Create a date for TODAY with the time from form
    const medDate = new Date();
    medDate.setHours(hours);
    medDate.setMinutes(minutes);
    medDate.setSeconds(0);
    medDate.setMilliseconds(0);

   const now = new Date();

    // ❌ Reject if medication time is in the past
    if (medDate <= now) {
      req.flash("error", "Medication time must be in the future!");
      return res.redirect("/health");
    }

    // Save medication
    const med = new Medication({
      medicine: medName,
      medTime: medDate,   // store as Date
      owner: req.user._id
    });

   const user = await User.findById(req.user._id);
    await med.save();

     const cronExp = `${minutes} ${hours} * * *`;
    //  const cronExp = `*/1 * * * *`;

    schedule.scheduleJob(cronExp, async () => {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Your Medication Reminder",
            text: `Your ${med.medicine} medicine time`
          });
    
          console.log("📨 Email sent ");
        } catch (err) {
          console.log("❌ Email ERROR:", err);
        }
      });


    req.flash("success", "Medication saved!");
    res.redirect("/health");
  } catch (err) {
    next(err);
  }
};

module.exports.addSleep = async (req ,res ,next)=>{
   const { sleepDate, sleepHours } = req.body;

    const selectedDate = new Date(sleepDate);
  const now = new Date();

    // ❌ Reject past date/time
    if (selectedDate > now) {
      req.flash("error", " Future sleep time Error!");
      return res.redirect("/health");
    }

     const sleep = new Sleep({
      sleepDate: sleepDate,
      hours: sleepHours,   
      owner: req.user._id
    });

    await sleep.save();

   req.flash("success", "sleep history uploaded !");
  res.redirect("/health");
} 

module.exports.addCare = async(req,res,next)=>{

 const count = await Caregiver.countDocuments({ owner: req.user._id });

  if (count >= 3) {
    req.flash("error", "You can add only 3 caregivers.");
    return res.redirect("/health");
  }
  const { name, phone,relation,email } = req.body;

       const care = new Caregiver({
      name: name,
      phone: phone,
      email: email,
      relation: relation,  
      owner: req.user._id
    });

 await care.save();

   req.flash("success", "CareGiver Added!!");
  res.redirect("/health");
}

module.exports.DestroyMed = async (req,res)=>{
    let {id} = req.params;
    let delList =  await  Medication.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success", "Medication Cancelled!");
  res.redirect("/health");
}

module.exports.destroyCare = async (req,res)=>{
    let {id} = req.params;
    let delList =  await  Caregiver.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success", "Caregiver removed!");
  res.redirect("/health");
}

module.exports.SOSalert = async (req ,res)=>{
      const userId = req.user._id;

    // Get all caregivers of this user
    const caregivers = await Caregiver.find({ owner: userId });

    if (caregivers.length === 0) {
      req.flash("error", "No caregivers added. Please add at least one.");
      return res.redirect("/health");
    }

    // Message text
    const msgText = `🚨 RETIREASE SOS ALERT!\n\n${req.user.username} needs urgent help!\nPlease contact them immediately.`;


    for (let c of caregivers) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: c.email,                  // caregiver email (must add in schema)
        subject: "🚨 SOS Alert — RetireEase",
        text: msgText,
      });
    }

    req.flash("success", "SOS alert sent to all caregivers!");
    res.redirect("/health");
}

module.exports.DestroyRecord = async (req,res)=>{
    let {id} = req.params;

   const rec = await record.findById(id);

    // If file exists → delete from uploads folder
    if (rec.image && rec.image.filename) {
      const filePath = path.join(__dirname, "..", "uploads", rec.image.filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("File delete error:", err);
        } else {
          console.log("Deleted file:", rec.image.filename);
        }
      });
    }

    let delList =  await  record.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success", "Booking Cancelled!");
  res.redirect("/health");
}


