// Review / rating / createdAt / ref to tour / ref to user

const mongoose = require("mongoose");
const Tour = require('./tourModel')

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


// Each Combination of tour and user has always to be unique
reviewSchema.index({ tour:1, user:1 },{ unique:true });

reviewSchema.pre(/^find/,function(next){
  this.populate({
    path:'tour',
    select:'name'
  }).populate({
    path:'user',
    select:'name photo'
  })
  next();
})


reviewSchema.statics.calcAverageRatings = async function(tourId){
  const stats =await this.aggregate([
    {
      $match:{tour:tourId} 
    },
    {
      $group:{
        _id:'$tour',
        // add one foreach tour that was matched in the previous step
        nRating:{ $sum : 1 },   
        avgRating:{ $avg :'$rating'}
      }
    },    
  ]);
  console.log(stats);

  await Tour.findByIdAndUpdate(tourId,{
    ratingsQuantity:stats[0].nRating,
    ratingsAverage:stats[0].avgRating
  });
}

reviewSchema.post('save',function(next){
  // this point to current review

  // this.tour inside the calcAverageRatings is the tour id that passed in the calcAverageRatings function
  this.constructor.calcAverageRatings(this.tour);
});



reviewSchema.pre(/^findOneAnd/, async function(next){
  this.r = await this.findOne();
  console.log(this.r);  
  next();
})

reviewSchema.post(/^findOneAnd/, async function(){
  // this.r = await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
})


const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;


