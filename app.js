const express = require('express');
const morgan = require('morgan')
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean'); 
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoute = require('./Router/tourRoutes'); 
const userRoute = require('./Router/userRoutes'); 
const reviewRoute = require('./Router/reviewRoutes')
const app = express();


app.use(express.json());

console.log(process.env.NODE_ENV);
// 1 - Global Middlewares  

// Developement Logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan("dev"));
}

// Set HTTP Headers 
app.use(helmet());

// Limit Request From Same API
const limiter = rateLimit({
  max:100,
  windowMs: 60 * 60 * 1000,
  message:'Too many Request from this IP , Please Try again in an hour!'
});
app.use('/api',limiter);

// Body Parser, reading data from the Body into req.body
app.use(express.json({limit:'10kb'}));

// Data Sanitization Against NoSQL query Injection
app.use(mongoSanitize());

// Data Sanitization Against XSS
app.use(xss()); 

// Prevent Paramenter polution
app.use(hpp({
  whitelist:['duration',
  'ratingQuantity',
  'ratingAverage',
  'maxGroupSize',
  'difficulty',
  'price']
}));

// Serving Static Files 
app.use(express.static(`${__dirname}/public`));

// Test Middleware 
app.use((req, res,next)=> {
  req.requestTime = new Date().toISOString();
  console.log(req.headers)
  next();
});

app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews',reviewRoute);

app.all('*',(req,res,next)=>{
  next(new AppError(`Cant find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorHandler);

module.exports = app;






