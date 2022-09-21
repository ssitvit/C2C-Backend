const jwt = require("jsonwebtoken");
const authorization = async (req, res, next) => {
  const token1 = req.cookies.token1;
  const payload1 = req.cookies.payload1;
  const header1 = req.cookies.header1;

  if (token1 == undefined || payload1 == undefined || header1 == undefined) {
    return res
      .status(200)
      .clearCookie("token1", {
        secure: process.env.NODE_ENV === "production",
        sameSite:'none',
        path: '/',
        httpOnly: true,
        
      })
      .clearCookie("payload1", {
        secure: process.env.NODE_ENV === "production",
        sameSite:"none",
        path: '/',
        
      })
      .clearCookie("header1",'', {
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
  const accessToken = header1 + "." + payload1 + "." + token1;

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (error, data) => {
      if (error)
        return res
          .status(200)
          .clearCookie("token1", {
            secure: process.env.NODE_ENV === "production",
            sameSite:'none',
            path: '/',
            httpOnly: true,
            expire:"Thu, 01 Jan 1969 00:00:00 GMT"
          })
          .clearCookie("payload1", {
            secure: process.env.NODE_ENV === "production",
            sameSite:"none",
            path: '/',
            expire:"Thu, 01 Jan 1969 00:00:00 GMT" 
          })
          .clearCookie("header1", {
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            path: '/', 
            expire:"Thu, 01 Jan 1969 00:00:00 GMT"
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
  } catch(error) {
    res.sendStatus(200).send({
      success: false,
      data: {
        error: error,
      },
    });
  }
};

module.exports = authorization;
