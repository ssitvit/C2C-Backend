const express = require("express");
const app = express();
const router = express.Router();
const LoginData = require("../schemas/userSchema");
const SaveData = require("../schemas/codeDetails");
const jwt = require("jsonwebtoken");
const adminAuth = require("../helpers/adminAuth");
let adminDb = ["sambhav", "devansh", "ganesh", "vishnu", "aditya"];

router.post("/user/login/", adminAuth, async (req, res) => {
  for (let i = 0; i < adminDb.size; i++) {
    if (adminDb[i] == req.body.username) {
      if (req.body.password == "admin@123789#") {
        const token = await jwt.sign(
          { userDetails: "sambhav" },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        res.status(200).body({ success: true, data: { data: token } });
      }
    }
  }
  res.send({
    success: false,
    data: {
      error: "admin user does not exist",
    },
  });
});

router.post('/user/getAllSavedCode',adminAuth,async(req,res)=>{
    
})

module.exports = router;
