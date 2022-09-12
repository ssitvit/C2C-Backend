const express = require("express");
const app = express();
const router = express.Router();
const LoginData = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authorization=require('../helpers/auth')
router.post("/signup", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPasswowrd = await bcrypt.hash(req.body.password, salt);

    const data = await LoginData.findOne({ email: req.body.email });
    if (data) {
      res.status(400).send({
        success: false,
        data: {
          error: "User already exists",
        },
      });
    } else {
      const newUser = new LoginData({
        registration_number: req.body.registration_number,
        email: req.body.email,
        password: hashedPasswowrd,
        mobile_number: req.body.mobile_number,
        first_name:req.body.first_name,
        last_name:req.body.last_name
      });
      const user = await newUser.save();
      res.status(200).send({
        success: true,
        data: {
          data: "User stored successfully",
        },
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      data: {
        error: error,
      },
    });
  }
});
router.post("/login", async (req, res) => {
    
  try {
    const userData = await LoginData.findOne({ email: req.body.email });
    console.log(userData)
    const validPassword = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (validPassword) {

      const token =await jwt.sign(
        { userDetails: userData.email },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "2h",
          }
      );

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .send({success:true, data: {
            data:"Logged in successfully"
        }});
      //   res.status(200).send({ success: true, data: {} });
    } else {
      res.status(401).send({
        success: false,
        data: {
          error: "Invalid credentials",
        },
      });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});
router.get('/logout',authorization,(req,res,next)=>{
    res
    .clearCookie("token")
    .status(200)
    .json({success:true, data:{data:"Successfully logged out"}} );
})
// router.get('/checkauth',authorization,(req,res,next)=>{
//     res.send("auth is working")
// })
module.exports = router;
