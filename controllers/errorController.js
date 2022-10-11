const AppError = require('./../utils/appError');
const handleCastErrorDB = err =>{
  console.log('fired');
  const message = `invalid ${err.path}: ${err.value}.`
  return new AppError(message,400)
}


const handleDuplicateFieldsDB = err =>{
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; 
  console.log(value)
  const message = `Duplicate Field value: x. Please use another value`

  return new AppError(message,400);
}
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorprod = (err, res) => {
  // Operational, trusted error : send message to client 
  if (err.isOperational ) {
    res.status(err, res).json({
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

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {...err};
    // Cast Error Controller handleCastErrorDB-> Related to DB / handleCastErrorDB is assigned to the middleware err
    if(error.name === 'CastError') error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorprod(error, res);
  }
};
