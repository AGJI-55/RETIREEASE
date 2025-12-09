const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const BlogSchema = new Schema({
   title: {
    type: String,
    required: true,
    trim: true
  },
  caption: {
    type: String,
    required: true
  },
 image:{
  url: String,          
  filename: String
     },
  type: {
    type: String,
    default: "Blog"
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
     likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Blog", BlogSchema);
