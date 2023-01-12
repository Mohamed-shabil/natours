const AppError = require('./../utils/appError');

const handleCastErrorDB = err =>{
  const message = `invalid ${err.path}: ${err.value}.`
  return new AppError(message,400)
}

const handleDuplicateFieldsDB = err =>{
  const value = err.keyValue//.match(/(["'])(\\?.)*?\1/);
   
  const message = `Duplicate Field value:" ${Object.values(value)} "Please use another value`
  console.log(message);
  return new AppError(message,400)
}

const handleValidationErrorDB = err=>{
  const errors = Object.values(err.errors).map(el => el.message);
  const message= ` Invalid input data. ${errors.join('. ')}`;
  return new AppError(message,400);
}

const handleJWTError = err => new AppError('Invalid Token',401);
const handleJWTExpiredError = err => new AppError('Your Token has expired ! Please Login again.',401);


const sendErrorDev = (err,req,res) => {
  // Api 
  console.log(req.originalUrl);

  if(req.originalUrl.startsWith('/api')){
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  else{
  //  RENDERED WEBSITE 
    res.status(err.statusCode).render('error',{
      title:'Something Went Wrong !',
      msg: err.message
    })
  }
};

const sendErrorprod = (err, req,res) => {
  // Operational, trusted error : send message to client 
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  // Programming or other unknown error:don't leak error details 
  } 
  else {
    // 1 - Log error
    console.error('Error 🔥', err);
    res.status(500).json({
      status: "error",
      message: "Something Went very Wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err,req,res);
  } else if (process.env.NODE_ENV === 'production') {

    let error = { ...err };
    
    console.log('its working ',error);

    // Cast Error Controller handleCastErrorDB-> Related to DB / handleCastErrorDB is assigned to the middleware err
    if(err.name === 'CastError') error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    if(err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if(err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if(err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendErrorprod(error,req , res);
  }
};

