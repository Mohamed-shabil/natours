const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel')
const factory = require('./handlerFactory');

// Multer Configuation

// const multerStorage = multer.diskStorage({
//   destination:(req, file, cb) =>{
//     cb(null , 'public/img/users');
//   },
//   filename:(req, file, cb) =>{
//     // file name be like  user-userId-currentTimesStamp
//     const ext = file.mimetype.split('/')[1]; 
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// })

const multerStorage = multer.memoryStorage();


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

exports.resizeUserPhoto = catchAsync(async(req, res ,next)=>{
 if(!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

 await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`);

 next();
 });


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


  // 1) Create Error if user Posts password data
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('This Route Not  for Password updates. please use /updateMyPassword',400));
  }

  // 2) filtered out unwanted Fields name that are not allowed to be updated
  const filteredBody = filterObj(req.body,'name','email');
  if(req.file) filteredBody.photo = req.file.filename;

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
  