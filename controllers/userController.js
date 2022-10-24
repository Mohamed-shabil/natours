const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel')

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
  
exports.updateUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "this route is not defined yet",
    });
  };
  
exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "this route is not defined yet",
    });
  };
  