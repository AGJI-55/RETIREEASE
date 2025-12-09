const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const MedicationSchema = new Schema({
  medicine: String,
   medTime: {
    type: Date,   // REAL DATE
    required: true
  },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Medication", MedicationSchema);