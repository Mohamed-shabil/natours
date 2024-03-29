
const path = require('path');
const express = require('express');
const morgan = require('morgan')
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean'); 
const hpp = require('hpp');
const cookieParser = require('cookie-parser')

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoute = require('./Router/tourRoutes'); 
const userRoute = require('./Router/userRoutes'); 
const reviewRoute = require('./Router/reviewRoutes')
const viewRoute = require('./Router/viewRoutes')
const app = express();


app.use(express.json());


console.log(process.env.NODE_ENV);
// 1 - Global Middlewares  

// Serving Static Files 
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'))

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

// app.use(express.urlencoded({extended:true,limit:'10kb'}))

// cookie Parser , reading data from cookie 
app.use(cookieParser())
 
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


// Test Middleware 
app.use((req, res,next)=> {
  req.requestTime = new Date().toISOString();
 
  next();
});


// Routes 

app.use('/',viewRoute);
app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews',reviewRoute);

app.all('*',(req, res,next)=>{
  next(new AppError(`Cant find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorHandler);

module.exports = app;






