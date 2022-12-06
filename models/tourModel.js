const mongoose = require('mongoose');
const slugify = require('slugify');
const validator= require('validator');
// const User = require('./userModel');
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true,'A tours Must have a Name'],
      unique: true,
      maxlength:[40,'a tour must have less or equal then 40 characters'],
      minlength:[10,'a tour must have grater or equal then 10 characters'] ,
      // validate: [validator.isAlpha,'Tour name must only contain characters']
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
      required:[true,'A tour Must have a Difficulty'],
      enum:{
        values:['easy','medium','difficult'],
        message:'Difficulty is either: easy, medium, or difficult'
      }
    },
    ratingAverage:{
      type:Number,
      default:4.5,
      min:[1,'Rating must be above 1.0'],
      max:[5,'Rating must be below 5.0']
    },
    ratingQuantity:{
      type:Number,
      // default:0
    }, 
    price:{
      type: Number,
      required: [true,'A tour Must have a Price'] 
    },
    priceDiscount:{
      type:Number,
      validate:{
        
        // this only points to current doc on New Document creation

        validator: function(value){
          return value < this.price;
        },
        message:'Discount price should be below regular price'
      }
    },
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
    startLocation:{
      // GeoJSON
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinates:[Number],
      address:String,
      description:String
    },
    locations:[
      {
        type:{
          type:String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    ],
    guides:[
      {
        type:mongoose.Schema.ObjectId,
        ref:'User'
      }
    ]
  },
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  });



  // DOCUMENT MIDDLEWARE : Runs before .save() and .create()

  // tourSchema.pre('save',async function(next){
  //   const guidesPromises = this.guides.map(async id=> await User.findById(id));
  //   this.guides = await Promise.all(guidesPromises);
  //   next();
  // })

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

  tourSchema.pre(/^find/,function(next){
    this.populate({
      path:'guides',
      select:'-__v -passwordChangedAt'
    });
    next();
  })

  // Query Middleware
  tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}});
    this.start = Date.now();
    next(); 
  })



  // Aggregation Middleware

  tourSchema.pre('aggregate',function(next){
    console.log(this.pipeline().unshift({ $match : { secretTour : { $ne:true } } }))
    next();
  })

  const Tour = mongoose.model('Tour', tourSchema);

  module.exports =Tour;