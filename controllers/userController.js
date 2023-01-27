const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel')
const factory = require('./handlerFactory');

const multerStorage = multer.diskStorage({
  destination:(req, file, cb) =>{
    cb(null , 'public/img/users');
  },
  filename:(req, file, cb) =>{
    // file name be like  user-userId-currentTimesStamp
    const ext = file.mimetype.split('/')[1]; 
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
})

const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null, true);
  }else{
    cb(new AppError('Not an image !, Please upload only images.',400),false)
  }
}

const upload = multer({
  storage :multerStorage,
  fileFilter:multerFilter,
}); 

exports.uploadUserPhoto = upload.single('photo');

const filterObj =(obj, ...allowedFields) =>{
  const newObj = {};

  Object.keys(obj).forEach(el=>{ 
    if(allowedFields.includes(el)) newObj[el]= obj[el];
  }) 

  return newObj;
}
exports.getAllUser = factory.getAll(User);

exports.getMe= (req, res, next)=>{
  req.params.id = req.user.id;  
  next()
} 

exports.updateMe = catchAsync(async(req,res, next)=>{

  console.log(req.file);
  console.log(req.body);
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
  
exports.getUser = factory.getOne(User)
  
exports.createUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "this route is not defined ! please use /Signup Instead",
    });
  };
  

  // Do not update passwords with this !
  
exports.updateUser = factory.updateOne(User);
  
exports.deleteUser = factory.deleteOne(User);
  