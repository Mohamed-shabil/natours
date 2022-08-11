const express = require("express");
const morgan = require("morgan")
const tourRoute = require('./Router/tourRoutes') 
const userRoute = require('./Router/userRoutes') 
const app = express();


app.use(express.json());

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`))

app.use((req,res,next)=>{
  console.log('hello from middleware😊');
  next();
})
app.use((req, res,next)=> {
  req.requestTime = new Date().toISOString();
  next();
});



app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/user', userRoute);

module.exports = app;






