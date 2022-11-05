const nodemailer = require('nodemailer');

const sendEmail = options =>{
    // 1 Create a transporter
     const transporter = nodemailer.createTransport({
        service :'Gmail',
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
        // Activate in gmail 'Less secure app ' options
     })

    // 2 Define Email options for

    // 3 Actually send the mail
}