const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const SleepSchema = new Schema({
   sleepDate: {
    type: Date,   // REAL DATE
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Sleep", SleepSchema);