const jwt = require("jsonwebtoken");
const authorization = async (req, res, next) => {
  const token = req.cookies.token;
  const payload = req.cookies.payload;
  const header = req.cookies.header;

  if (token == undefined || payload == undefined || header == undefined) {
    return res
      .status(200)
      .clearCookie("token", {
        secure: process.env.NODE_ENV === "production",
        sameSite:'none',
        path: '/',
        httpOnly: true
      })
      .clearCookie("payload", {
        secure: process.env.NODE_ENV === "production",
        sameSite:"none",
        path: '/', 
      })
      .clearCookie("header", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: '/', 
      })
      .send({
        success: false,
        data: {
          error: "Unauthorised",
        },
      });
  }
  // const accessToken=token+'.'+payload+'.'+signature;
  const accessToken = header + "." + payload + "." + token;

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (error, data) => {
      if (error)
        return res
          .status(200)
          .clearCookie("token", {
            secure: process.env.NODE_ENV === "production",
            sameSite:'none',
            path: '/',
            httpOnly: true
          })
          .clearCookie("payload", {
            secure: process.env.NODE_ENV === "production",
            sameSite:"none",
            path: '/', 
          })
          .clearCookie("header", {
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            path: '/', 
          })
          .send({
            success: false,
            data: {
              error: "Unauthorised",
            },
          });

      if (data) {
        // console.log(data)
        return next();
      }
    });
  } catch {
    res.sendStatus(200).send({
      success: false,
      data: {
        error: "Error",
      },
    });
  }
};

module.exports = authorization;
