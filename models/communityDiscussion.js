const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const communityPostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  author: {
    type: String,
    default: "Anonymous"
  },

  content: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: "discussion"
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

module.exports = mongoose.model("CommunityDiscussion", communityPostSchema);
