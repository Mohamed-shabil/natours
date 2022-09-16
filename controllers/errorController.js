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
  if (err.isOperational) {
    res.status(err, res).json({
      status: err.status,
      message: err.message,
    });
  // Programming or other unknown error:don't leak error details 
  } else {
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
    if(err.name=== 'CastError'){
      
    }
    sendErrorprod(err, res);
  }
};
