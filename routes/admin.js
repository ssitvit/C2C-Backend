const express = require("express");
const app = express();
const router = express.Router();

let adminDb = ["sambhav", "devansh", "ganesh", "vishnu", "aaditya"];
router.post("/user/login/", async (req, res) => {
  for (let i = 0; i < adminDb.size; i++) {
    if (adminDb[i] == req.body.username) {
      if (req.body.password == "admin@123789#") {
        const token = await jwt.sign(
          { userDetails: userData._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
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

module.exports = router;
