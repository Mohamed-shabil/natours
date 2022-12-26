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


exports.getTour = factory.getOne( Tour ,{ path:'reviews'} );
exports.getAllTours = factory.getAll(Tour); 
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


// /tours-within/:distance/center/:latlng/unit

// /tours-within/233/center/34.111745,-118.113491/unit/mi

exports.getToursWithin = catchAsync(async (req,res,next) =>{
  const {distance , latlng , unit } = req.params;
  const [lat ,lng] = latlng.split(',');
  const radius = unit=== 'mi' ? distance/3963.2 : distance/6378.1; 

  if(!lat || !lng){
    next(new AppError('Please provide the latitude and langitude in the format lat,lng',400))
  }

  console.log(distance, lat , lng , unit );


  const tours = await Tour.find({ startLocation: { $geoWithin:{ $centerSphere: [[lng , lat ], radius ]} } })

  res.status(200).json({
    status:'success',
    results:tours.length,
    data:{
      data:tours
    }
  }); 
})

exports.getDistances = catchAsync(async (req,res,next)=>{
  console.log(req.params);
  const { latlng , unit } = req.params;
  console.log(latlng)
  // const latlng = '34.111745,-118.113491'
  const [lat,lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if(!lat || !lng){
    next(new AppError('Please provide the latitude and langitude in the format lat,lng',400))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear:{
        // near is the point from which to calculate the distances so all the distances will be calculated from this point 
        near : {
          type: 'point',
          coordinates : [lng * 1 , lat * 1]
        },
        distanceField : 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project:{ // project help to show only certain detail as we define
        distance :1 ,
        name:1,
    }
    }
  ])

  res.status(200).json({
    status:'success',
    data:{
      data:distances
    }
  });
})