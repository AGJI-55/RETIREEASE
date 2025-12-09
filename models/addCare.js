const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const AddCareSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email:{
    type: String,
     required: true
  },
  phone: {
    type: String,   // better than Number
    required: true
  },

  relation: {
    type: String,
    required: true   // your missing part
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});


module.exports = mongoose.model("Caregiver", AddCareSchema);