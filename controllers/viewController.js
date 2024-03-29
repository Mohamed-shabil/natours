const Tours = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError'); 


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


exports.getTour =catchAsync(async(req,res,next)=>{
    // 1 get the data for the requested  tour (including reviews and guides)
    const slug = req.params.slug
    const tour = await Tours.findOne({slug}).populate({
        path:'reviews',
        fields:'review rating user'
    })
    if(!tour){
        return next(new AppError('There is no Tour With That Name',404));  
    }
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


exports.getSignupForm = catchAsync(async(req,res)=>{
    res.status(200).render('signup',{
        title:'Sigup to Create an Account'
    })
})

exports.getAccount = (req,res)=>{
    res.status(200).render('account',{
        title:'Your account'
    })
}

exports.updateUserData = catchAsync(async(req,res) =>{
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{
        name: req.body.name,
        email:req.body.email  
    },
    {
        new:true,
        runValidators:true
    });
    res.status(200).render('account',{
        title:'Your account',
        user:updatedUser 
    })
})