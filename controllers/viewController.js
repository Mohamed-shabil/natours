const { findOne } = require('../models/tourModel');
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

exports.getTour =catchAsync(async(req,res)=>{
    // 1 get the data for the requested  tour (including reviews and guides)
    const slug = req.params.slug
    const tour = await Tours.findOne({slug}).populate({
        path:'reviews',
        fields:'review rating user'
    })
    // 2 build template

    // 3 Render Template using the data
    res.status(200).render('tour',{
        title:`${tour.name} Tour`,
        tour
    })
})

exports.getLoginForm = catchAsync(async(req,res)=>{
    res.status(200).render('login',{
        title:'Log into your account'
    })
})