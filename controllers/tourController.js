const Tour = require("./../models/tourModel");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory')

exports.aliasTopTours = (req,res,next)=>{
  req.query.limit='5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
}


exports.getAllTours = catchAsync(async (req,res,next) => {
  
    const features = new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query;
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    }); 
});

exports.getTour = catchAsync(async (req, res,next) => {  
    const tour = await Tour.findById(req.params.id).populate('reviews');  
    console.log(tour.reviews);

    if(!tour){
      return next(new AppError('No Tour Found with that ID',404))
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
});






exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);



exports.getTourStats = catchAsync(async (req,res,next)=>{
    const stats = await Tour.aggregate([
      {
        $match:{ ratingAverage: { $gte: 4.5} }
      },
      { 
        $group:{
          _id:'$difficulty',
          numTours:{$sum:1},
          numRating:{$sum:'$ratingQuantity'},
          avgRating:{ $avg:'$ratingAverage'},
          avgPrice:{$avg:'$price'},
          minPrice:{$min:'$price'},
          maxPrice:{$max:'$price'}
        }
      }
    ]) 
    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    })
});

exports.getMonthlyPlan = catchAsync(async (req, res,next)=>{
    const year = req.params.year *1;
    const plan = await Tour.aggregate([
      {
        $unwind:'$startDates'
      },
      {
        $match:{
          startDates:{
            $gte: new Date(`${year}-01-01`), 
            $lte:  new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group:{
          _id:{$month:'$startDates'},
          numTourStarts:{$sum:1},
          tours:{$push:'$name'}
        },
      },
      {
        $addFields:{month:'$_id'}
      },
      { 
        $project:{
          _id:0
        }
      },
      { 
        $sort:{numTourStarts:-1} 
      },
      { 
        $limit:12
      }
    ])

    res.status(200).json({
      status: "success",
      data: {
        plan
      }
    })
});