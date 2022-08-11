const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true,'A tours Must have a Name'],
      unique: true
    },
    duration:{
      type: Number,
      required:[true,'A tour Must have a Duration'],

    },
    maxGroupSize:{
      type:Number,
      required:[true,'A tour Must have a Group Size'],
    },
    difficulty:{
      type:String,
      required:[true,'A tour Must have a Difficulty']
    },
    ratingAverage:{
      type:Number,
      default:4.5
    },
    ratingQuantity:{
      type:Number,
      default:0
    }, 
    price:{
      type: Number,
      required: [true,'A tour Must have a Price'] 
    },
    priceDiscount:Number,
    summary:{
      type:String,
      trim: true,
      required: [true,'A tour must have a Summary']
    },
    description:{
     type:String,
     trim:true
    },
    imageCover:{
      type:String,
      required: [true,'A tour must have a Cover Image']
    },
    images:[String],
    createAt:{
      type:Date,
      default: Date.now()
    },
    startDates:[Date]
  });
  const Tour = mongoose.model('Tour', tourSchema);

  module.exports =Tour;