// Review / rating / createdAt / ref to tour / ref to user

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: ["true", "Reviews can not be empty"],
  },
  rating: {
    type: Number,
    min: [0, "Rating Must be above 0"],
    max: [5, "Rating Must be below 5.0"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Review Must belong to a tour ."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required:[true,'Review must belong to a user']
  },
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
