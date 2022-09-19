const jwt = require("jsonwebtoken");
function adminAuthorization(req, res, next) {
  if (!req.body.data) {
    return res.status(200).body({
      success: false,
      data: {
        error: "Unauthorized",
      },
    });
  }
  try {
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (error, data) => {
      if (error) {
        res.send({
          success: false,
          data: {
            error: "Unauthorised",
          },
        });
      }
      if (data) {
        console.log(data)
        return next();
      }
    });
  } catch (error) {
    res.sendStatus(200).send({
      success: false,
      data: {
        error: "Error",
      },
    });
  }
}

module.exports = adminAuthorization;
