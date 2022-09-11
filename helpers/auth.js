const jwt = require("jsonwebtoken");
const authorization = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(403).send({
      success: false,
      data: {
        error: "Unauthorized",
      },
    });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return next();
  } catch {
    return res.sendStatus(403);
  }
};

module.exports = authorization;
