const express = require("express");
const morgan = require("morgan")
const rateLimit = require("express-rate-limit");
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRoute = require('./Router/tourRoutes') 
const userRoute = require('./Router/userRoutes') 
const app = express();


app.use(express.json());

console.log(process.env.NODE_ENV);
// 1 - Global Middlewares  
if(process.env.NODE_ENV === 'development'){
  app.use(morgan("dev"));
}


const limiter = rateLimit({
  max:100,
  windowMs: 60 * 60 * 1000,
  message:'Too many Request from this IP , Please Try again in an hour!'
})

app.use('/api',limiter);

app.use(express.static(`${__dirname}/public`))


app.use((req, res,next)=> {
  req.requestTime = new Date().toISOString();
  console.log(req.headers)
  next();
});



app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/users', userRoute);

app.all('*',(req,res,next)=>{
  next(new AppError(`Cant find ${req.originalUrl} on this server`,404) );
})

app.use(globalErrorHandler);

module.exports = app;






