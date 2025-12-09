const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  name: String,
  datetime: Date,
  type: String,
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Booking", BookingSchema);