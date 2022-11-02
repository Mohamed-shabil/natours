const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
 
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,'please tell us your name !'],
    },
    email:{
        type:String,
        required:[true,'please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:String,
    role:{
        type:String,
        // Enum for predefine some value for this key as shown in below
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'must have to confirm password'],
        validate:{
            validator:function(el){
                return el === this.password;
            },
            message:'Password are not the same'
        }
    },
    passwordChangedAt: Date
})

userSchema.pre('save', async function(next){
    // only run this function if the password is modified

    if(!this.isModified('password')) return next();
    
    // Hash the password with cost of 12

    this.password = await bcrypt.hash(this.password,12);
    
    // Delete the passwordConfirmed

    this.passwordConfirm = undefined;
    next(); 
})


/* 
   -> userSchame.methods. is used to create custom custom fuctions 
   -> bcrypt.compare hash the first password and compare with the original hashed password
   -> and as a result it return true / false value 
*/
   
userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}



userSchema.methods.changedPasswordAfter= function(JWTTimestamp){
    console.log("Iam working");
    if(this.passwordChangedAt){

       const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);

       console.log(changedTimestamp,JWTTimestamp);
       
       return JWTTimestamp < changedTimestamp; 
    }
    return false;
};


const User = mongoose.model('User',userSchema);

module.exports = User;