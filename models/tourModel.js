const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true,'A tours Must have a Name'],
      unique: true
    },
    slug:String,
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
      // default:0
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
    startDates:[Date],
    secretTour:{
      type:Boolean,
      default:false
    },
  },
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  });

  tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
  })
  // tourSchema.post('save',function(doc,next){
  //   console.log(doc);
  //   next();
  // })
  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
  })


  // Query Middleware
  tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}})
    next(); 
  })
  const Tour = mongoose.model('Tour', tourSchema);

  module.exports =Tour;