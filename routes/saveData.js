const express = require("express");
const app = express();
const router = express.Router();
const authorization = require("../helpers/auth");
const SaveData = require("../schemas/codeDetails");
const LoginData = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");

router.post("/submit", authorization, async (req, res) => {
  const token = req.cookies.token;
  const payload = req.cookies.payload;
  const header = req.cookies.header;
  const accessToken = header + "." + payload + "." + token;

  const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  try {
    const dataForVerify = await LoginData.findOne({ _id: data.userDetails });
    if (dataForVerify["round" + req.body.round] == false) {
      return res.status(400).send({
        success: false,
        data: {
          error: "User not qualified",
        },
      });
    }
    const alreadySavedCode = await SaveData.find({
      userDetails: data.userDetails,
      round: req.body.round,
    });
    if (alreadySavedCode.length != 0) {
      return res.status(400).send({
        success: false,
        data: {
          error: "User code already submitted",
        },
      });
    }

    const newData = new SaveData({
      userDetails: data.userDetails,
      html: req.body.html,
      css: req.body.css,
      round: req.body.round,
    });

    const user = await newData.save();
    res.status(200).send({
      success: true,
      data: {
        data: "User code stored successfully",
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
// <-----------------get all data of user from database------------------>
router.get("/check", authorization, async (req, res) => {
  const token = req.cookies.token;
  const payload = req.cookies.payload;
  const header = req.cookies.header;
  const accessToken = header + "." + payload + "." + token;

  const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  try {
    const dataForVerify = await LoginData.findOne({ _id: data.userDetails });
    if (dataForVerify["round" + req.body.round] == false) {
      return res.status(400).send({
        success: false,
        data: {
          error: "User not qualified",
        },
      });
    }
    const alreadySavedCode = await SaveData.find({
      userDetails: data.userDetails,
      round: req.body.round,
    });

    if (alreadySavedCode.length != 0) {
      return res.status(400).send({
        success: false,
        data: {
          error: "User code already submitted",
        },
      });
    }
    res.status(200).send({
      success: true,
      data: {
        data: "User can start the test",
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

// <-------------------get saved code for a user ---------------------->
router.post("/getsavedCode", authorization, async (req, res) => {
  const token = req.cookies.token;
  const payload = req.cookies.payload;
  const header = req.cookies.header;
  const accessToken = header + "." + payload + "." + token;

  const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  try {
    const alreadySavedCode = await SaveData.find({
      userDetails: data.userDetails,
      round: req.body.round,
    });
    if (alreadySavedCode.length == 0) {
      return res.status(400).send({
        success: false,
        data: {
          error: "No code submitted",
        },
      });
    }
    res.send({
      success: true,
      data: {
        data: alreadySavedCode,
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
module.exports = router;
