const fs=require("fs");
const mongoose = require('mongoose');
const dotenv=require('dotenv');
const Tour = require('./../../models/tourModel') 
dotenv.config({path:'./config.env'})

const DB =process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify: false
})
.then( ()=>{console.log('DB Connection Successful !');})   

// Read Json File

const tours = JSON.parsefs.readFileSync('tours-simple.jon','utf-8');

// Import Data Into DB

  const importData = async ()=>{
    try{
        await Tour.create(tours)
    }catch(err){
       console.log(err);
    }
}