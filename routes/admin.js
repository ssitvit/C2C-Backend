const express = require("express");
const app = express();
const router = express.Router();
const LoginData = require("../schemas/userSchema");
const SaveData = require("../schemas/codeDetails");
const jwt = require("jsonwebtoken");
const authorization = require("../helpers/adminAuth");


router.post("/user/login/", async (req, res) => {
  let adminDb = ["sambhav", "devansh", "ganesh", "vishnu", "aditya"];
  if (!req.body.username || !req.body.password) {
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
        res.cookie("token1", signature1, {
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
        return res.status(200).send({
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
    let allsavedcode = await SaveData.find({ round: req.body.round });
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

router.post("/user/getUserDetails", authorization, async (req, res) => {
  if (!req.body.userDetails) {
    return res
      .status(200)
      .send({ success: false, data: { error: "Userdeatils not given" } });
  }
  try {
    let userData = await LoginData.findById(req.body.userDetails);
    userData.password = "";
    return res.status(200).send({ success: true, data: { data: userData } });
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
// <-----------------------------------updating score for a user by admin -------------------------->
router.post("/score", authorization, async (req, res) => {
  if (!req.body.userDetails)
    return res
      .status(200)
      .send({ success: false, data: { error: "userdetails not given" } });
  try {
    let userData = await LoginData.findById(req.body.userDetails);
    userData[`round${req.body.round}Score`] = req.body.score;
   
    await userData.save();
    return res
      .status(200)
      .send({ success: true, data: { data: "score updated successfully" } });
  } catch (error) {
    res.status(200).send({
      success: false,
      data: {
        error: error,
      },
    });
  }
});

router.post("/getScoreSort", authorization, async (req, res) => {
  if (!req.body.round)
    return res
      .status(200)
      .send({ success: false, data: { error: "round not specified" } });
  try {
    let data;
    if (req.body.round == 1) {
      data = await LoginData.find({ round1: true }).sort({
        round11Score: -1,round12Score:-1
      });
    }
     else if (req.body.round == 2) {
      data = await LoginData.find({ round2: true }).sort({
        round2Score: -1,
      });
    } else if (req.body.round == 3) {
      data = await LoginData.find({ round3: true }).sort({
        round3Score: -1,
      });
    }
    
    if (data)
      return res.status(200).send({ success: true, data: { data: data } });
  } catch (error) {
    res.status(200).send({
      success: false,
      data: {
        error: error,
      },
    });
  }
});

router.post("/setroundpresent", authorization, async (req, res) => {
  console.log(req.body)
  if ( !req.body.round) {
    return res.status(200).send({
      success: false,
      data: { error: "round not specified or userdetails not specified" },
    });
  }
  try {
    let userData = await LoginData.findById(req.body.userDetails);
    
    if(req.body.roundno==1){
      userData.round1 = req.body.round;
    }else if(req.body.roundno==2){
      userData.round2 = req.body.round;
    }else if(req.body.roundno==3){
      userData.round3 = req.body.round;
    }
  
  let data= await userData.save();
  if(data){
    res.status(200).send({
      success: true,
      data: {
        data: "user attendence updated"
      },
    });
  }
    
  } catch (error) {
    res.status(200).send({
      success: false,
      data: {
        error: error,
      },
    });
  }
});
router.post("/checkauth", authorization, async (req, res, next) => {
 
  const token = req.cookies.token1;
  const payload = req.cookies.payload1;
  const header = req.cookies.header1;
  const accessToken = header + "." + payload + "." + token;

  const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  if(data) return res.status(200).send({success:true,data:{
    data:data
  }})
  
});
router.get('/getAllUsersData',authorization,async(req,res)=>{
  try {
    const data=await LoginData.find()
    if(data){
      res.status(200).send({success:true,data:{
        data:data
      }})
    }
  } catch (error) {
    res.status(200).send({
      success: false,
      data: {
        error: error,
      },
    });
  }
})
module.exports = router;
