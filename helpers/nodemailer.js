const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // service:'Gmail',
      port: 465,
      secure: true,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: process.env.HOST,
        pass: process.env.PASS,
      },
    });
    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });
    let mailOptions = {
      from: "no@reply.com",
      to: email,
      subject: subject,
      text: "Click on the following link to verify your email address",
      html: `<a href=${text}>Click Here</a>`,
    };
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);
        }
      });
    });
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
    // console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
    return res.status(400).send({ success: false, data: { data: "Something went wrong" } });
  }
};

module.exports = sendEmail;
