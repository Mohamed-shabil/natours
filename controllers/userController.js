const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel')
const factory = require('./handlerFactory');

const filterObj =(obj, ...allowedFields) =>{
  const newObj = {};

  Object.keys(obj).forEach(el=>{ 
    if(allowedFields.includes(el)) newObj[el]= obj[el];
  }) 

  return newObj;
}
exports.getAllUser = catchAsync(async(req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users
    },
  }); 
  });


exports.updateMe = catchAsync(async(req,res, next)=>{
  // 1) Create Error if user Posts password data
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('This Route Not  for Password updates. please use /updateMyPassword',400));
  }

  // 2) filtered out unwanted Fields name that are not allowed to be updated
  const filteredBody = filterObj(req.body,'name','email');

  // 3 - Update Document
  const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
    new:true,
    runValidators:true
  });
  res.status(200).json({
    status: 'Success',
    data:{
      user:updatedUser 
    }
  })
})


exports.deleteMe = catchAsync(async (req,res,next) => {
  await User.findByIdAndUpdate(req.user.id,{active:false})

  res.status(204).json({
    status: "success",
    data:null
  })
})
  
exports.getUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "this route is not defined yet",
    });
  };
  
exports.createUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "this route is not defined yet",
    });
  };
  

  // Do not update passwords with this !
exports.updateUser = factory.updateOne(User)
  
exports.deleteUser = factory.deleteOne(User);
  