const express = require("express");

const app = express();
const router = express.Router();
const LoginData = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authorization = require("../helpers/auth");

const Token = require("../schemas/token");
const sendEmail = require("../helpers/nodemailer");

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
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        universityName: req.body.universityName,
        refreal:
          req.body.refreal == "" || req.body.refreal == undefined
            ? ""
            : req.body.refreal,
      });
      const user = await newUser.save();
      await sendVerifyEmail(user);

      res.status(200).send({
        success: true,
        data: {
          data: "User stored successfully and email sent successfully",
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

router.post("/sendEmailAgain", async (req, res) => {
  try {
    const user = await LoginData.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send({
        success: false,
        data: {
          error: "User email does not exist",
        },
      });
    if (user.emailIsVerified == true) {
      return res.status(200).send({
        success: true,
        data: {
          data: "User email already verified",
        },
      });
    }
    await sendVerifyEmail(user);
    return res.send({
      success: true,
      data: {
        data: "Verification Email sent ",
      },
    });
  } catch (error) {
    res.send({
      success: "false",
      data: {
        error: error,
      },
    });
  }
});

const sendVerifyEmail = async (user) => {
  try {
    const findtoken = await Token.findOne({ userId: user._id });
    if (findtoken) {
      const message = `${process.env.BASE_URL}/user/verify/${user.id}/${findtoken.token}`;
      await sendEmail(user.email, "Verify Email", message);
      return;
    }
    let newtoken = await new Token({
      userId: user._id,
      token: Math.floor(Math.random() * 1000000000),
    });

    const token = await newtoken.save();

    const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token} `;
    await sendEmail(user.email, "Verify Email For C2C Portal", message);
  } catch (error) {
    res.send({
      success: "false",
      data: {
        error: error,
      },
    });
  }
};

router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await LoginData.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({
        success: false,
        data: {
          error: "Invalid link",
        },
      });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).send({
        success: false,
        data: {
          error: "Invalid link",
        },
      });

    let userdata = await LoginData.findOne({ _id: user._id });
    userdata.emailIsVerified = true;
    await userdata.save();
    await Token.findByIdAndRemove(token._id);

    res.status(200).send({
      success: true,
      data: {
        data: "Email Verified Successfully",
      },
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await LoginData.findOne({ email: req.body.email });
    // console.log(userData)
    if (userData == null) {
      return res.status(400).send({
        success: false,
        data: {
          error: "User does not exists",
        },
      });
    }

    if (userData.emailIsVerified == false) {
      return res.status(401).send({
        success: false,
        data: {
          error: "Email Not verified",
        },
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (validPassword) {
      const token = await jwt.sign(
        { userDetails: userData._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      let header = token.split(".")[0];
      let payload = token.split(".")[1];
      let signature = token.split(".")[2];
      // console.log(header,payload,signature);
      res
        .status(200)
        .setHeader("Set-Cookie", [`header=${header}`, `payload=${payload}`])
        .cookie("token", signature, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",

          sameSite: "none",
        });

      // res.cookie("header", header, { sameSite: "none" });
      // res.cookie("payload", payload, { sameSite: "none" });
      res.send({
        success: true,
        data: {
          data: "Logged in successfully",
        },
      });
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

router.get("/logout", authorization, (req, res, next) => {
  res
    .clearCookie("token")
    .clearCookie("payload")
    .clearCookie("header")
    .status(200)
    .json({ success: true, data: { data: "Successfully logged out" } });
});
router.get("/checkauth", authorization, async (req, res, next) => {
  const token = req.cookies.token;
  const payload = req.cookies.payload;
  const header = req.cookies.header;
  const accessToken = header + "." + payload + "." + token;

  const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  try {
    let user = await LoginData.findOne({ _id: data.userDetails });
    user.password = "";
    return res.status(200).send({
      success: true,
      data: {
        data: user,
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
