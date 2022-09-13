const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.HOST,
          pass: process.env.PASS
        }
    });
    var mailOptions = {
        from: 'no@reply.com',
        to: email,
        subject: subject,
        text:"Click on the following link to verify your email address",
        html:`<a href=${text}>Click Here</a>`
      };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    // console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
