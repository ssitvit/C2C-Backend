const express = require("express");
const app = express();
const router = express.Router();
const LoginData = require("../schemas/userSchema");
const SaveData = require("../schemas/codeDetails");
const jwt = require("jsonwebtoken");
const authorization = require("../helpers/adminAuth");


router.post("/user/login/", async (req, res) => {
    let adminDb = ["sambhav", "devansh", "ganesh", "vishnu", "aditya"];
    if(!req.body.username || !req.body.password){
       return res.status(200).send({
            success: false,
            data: {
              error: "send all the details",
            },
          });
    }
  for (let i = 0; i < adminDb.length; i++) {
    
    if (adminDb[i] === req.body.username) {
      if (req.body.password == process.env.ADMINPASS) {
        const token = await jwt.sign(
          { userDetails: adminDb[i] },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        let header1 = token.split(".")[0];
        let payload1 = token.split(".")[1];
        let signature1 = token.split(".")[2];
        res
          .status(200)

          .cookie("token1", signature1, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "none",
          });

        res.cookie("header1", header1, {
          sameSite: "none",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        res.cookie("payload1", payload1, {
          sameSite: "none",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
       return res.send({
          success: true,
          data: {
            data: "Logged in successfully",
          },
        });
      }
    }
  }
  res.status(200).send({
    success: false,
    data: {
      error: "admin user does not exist",
    },
  });
});

router.post("/user/getAllSavedCode", authorization, async (req, res) => {
  try {
    let allsavedcode = await SaveData.find({round:req.body.round});
    res.status(200).send({
      success: true,
      data: {
        data: allsavedcode,
      },
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      data: {
        error: error,
      },
    });
  }
});
router.get("/logout", authorization, async (req, res, next) => {
    res
      .clearCookie("token1", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        httpOnly: true,
        // expire:"Thu, 01 Jan 1969 00:00:00 GMT"
      })
      .clearCookie("payload1", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        // expire:"Thu, 01 Jan 1969 00:00:00 GMT"
      })
      .clearCookie("header1", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        // expire:"Thu, 01 Jan 1969 00:00:00 GMT"
      });
  
    res
      .status(200)
      .json({ success: true, data: { data: "Successfully logged out" } });
  });
module.exports = router;
