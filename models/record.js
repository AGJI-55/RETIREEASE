const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecordSchema = new Schema({
title: {
        type:String,
        required : true,
    },
 image:{
  url: String,          
  filename: String
     },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Record", RecordSchema);
