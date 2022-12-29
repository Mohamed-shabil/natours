const Tours = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
exports.getOverview = catchAsync( async (req,res) =>{
    // 1 Get tour data from collection 
    const tours = await Tours.find()
    console.log(tours.name);
    // 2 Build template 
    // render that template using tour from 1
    res.status(200).render('overview',{
        title:'All Tours',
        tours
    });
})

exports.getTour =(req,res)=>{
    // 1 get the data for the requested  tour (including reviews and guides ) 
    res.status(200).render('tour',{
        title:'The Forest Hicker'
    })
}