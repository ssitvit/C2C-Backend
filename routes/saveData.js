const express = require("express");
const app = express();
const router = express.Router();
const authorization = require("../helpers/auth");
const SaveData = require("../schemas/codeDetails");
const LoginData = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");
const { returnRound1a } = require("../helpers/imagesString");
const { returnRound1b } = require("../helpers/imagesString");
const { returnRound2 } = require("../helpers/imagesString");
const { returnRound3 } = require("../helpers/imagesString");

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
router.post("/check", authorization, async (req, res) => {
  const token = req.cookies.token;
  const payload = req.cookies.payload;
  const header = req.cookies.header;
  const accessToken = header + "." + payload + "." + token;

  const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  try {
    const dataForVerify = await LoginData.findOne({ _id: data.userDetails });
    if (dataForVerify["round" + req.body.round] == false) {
      return res.status(200).send({
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
      return res.status(200).send({
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

router.post("/getimage", authorization, async (req, res) => {
  if (req.body.round == 1) {
    return res.status(200).send({
      success: true,
      data: {
        data: [returnRound1a(), returnRound1b()],
        body: "Clone the given image for round1",
        time: new Date(),
      },
    });
  } else if (req.body.round == 2) {
    return res.status(200).send({
      success: true,
      data: {
        data: [returnRound2()],
        body: "Clone the given image for round2",
        time: new Date(),
      },
    });
  } else if (req.body.round == 3) {
    return res.status(200).send({
      success: true,
      data: {
        data: [returnRound3()],
        body: "Imitate the following action. Make a 2 X 2 chess board with pieces as shown. The current position is a checkmate for black. On hover you have to make the same board change so that it is black to move and not a checkmate, an example is shown in the other figure. You may use HTML tags like svg, path , defs and g to make the chess pieces.",
        time: new Date(),
      },
    });
  }
});
module.exports = router;
