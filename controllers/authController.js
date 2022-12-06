const crypto = require('crypto');
const {promisify} = require('util')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


const signToken = id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res)=>{
    const token = signToken(user.id);

    const cookieOptions = { 
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // secure:true, This is not going to work in this development enviroment
         // because of https Not availabe.
        httpOnly : true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // Remove  the Password from the output
    user.password= undefined;
    res.cookie('jwt',token,cookieOptions)
    res.status(statusCode).json({
        status:'SUCCESS',
        token,
        data:{
            user
        }
  
    })
}

exports.signup = catchAsync( async(req,res,next)=>{

    // don't push the req.body directly to db because the the hackers can add any kind of to the data the req.body
    // so don't use User.create(req.body);

    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        passwordChangedAt:req.body.passwordChangedAt,
        role:req.body.role
    });

    createSendToken(newUser,201,res);
})

exports.login = catchAsync( async(req,res,next)=>{
    const {email,password} = req.body;

    // 1 check if the email and password exist
    if(!email || !password ){
        return next(new AppError('please provide email and password',400));
    }
    // 2 check if user exist && password is correct
    const user = await User.findOne({email}).select('+password');

    // the currectPassword function only runs when the user is exist, that way we can reduce the load of the app
    
    if(!user||!(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401));
        // -> the status code 401 indicate unautherisation
    }
    // 3 if everything is okay then sendback the token to the client
    createSendToken(user,200,res);
})

exports.protect = catchAsync(async (req, res,next)=>{

    let token;
    // 1. Getting token and check of it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('Your are not logged in ! Please Login to get access',401))
    }
    // 2. Varification token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    
    console.log(decoded)

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id)
    console.log(currentUser)

    if(!currentUser){
        return next(new AppError('The user belonging to this token is does no longer exist.'))
    }


    // 4. check if user changed password after the token was issued
    

    // the code is not working iam working on it 
    // if(currentUser.changedPasswordAfter(decoded.iat)){
    //     return next(new AppError('User recently Changed password ! please log in again.',401));
    // }

    // Grand Access to protected Route
    req.user = currentUser;
    
    next();

});
exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        //  roles ['admin','lead-guide']. roles='user'
        console.log(roles);
        if(!roles.includes(roles)){
            return next( new AppError('You do not have permission to perform this action',403));
        }
        next();
    }
} 

exports.forgotPassword = catchAsync(async(req,res,next)=>{
    // 1 - get user based on POSTed email
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new AppError('There is no user with email address',404));
    }

    // 2 - generate the randon reset tokens
    const resetToken = user.createPasswordResetToken(); 
    await user.save({ validateBeforeSave : false }); 


    // 3 - send it to users email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `Forgot your password ? Submit a PATCH request with your new Password and Password Confirm to:${resetURL}.\n if
    you didn't forgot your password ,please ignore this email!`;


    try{
        await sendEmail({
            email:req.body.email,
            subject:'Your password reset token (Valid for 10 min)',
            message
        });
        res.status(200).json({
            status:'success',
            message:'Token sent to email!', 
        })
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave : false }); 
        
        return next(new AppError('There was an error sending the mail. Try again later !'),500);
    }
})
exports.resetPassword = catchAsync( async(req,res,next)=>{

    // 1- get User based on the token 

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires:{$gt:Date.now()}
    }) 

    // 2- if token has not expired, and there is user , set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expired',400))
    }
    
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
     
    // 3- Update changedPasswordAt property for the user 

    // 4- Log the user in, send JWT
    createSendToken(user,200,res);
})

exports.updatePassword = catchAsync(async (req, res, next)=>{
    // 1 - get the user from collection 

    const user = await User.findById(req.user.id).select('+password')

    // 2 - check if the POSTed Current password is correct
      if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
        return next( new AppError('Your current password is Wrong.',401))
      }

    // 3 -  If the password is currect  , update Password 

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // User.findByIdAndUpdate is never use in this case because the instance functions and validator not works if the the findByIdAndUpdate works
    
    // 4 - log user in , send JWT
    createSendToken(user,200,res);
    next();
})