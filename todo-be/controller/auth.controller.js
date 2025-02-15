const authController = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// 토큰 값으로 userId를 추출해오는 api
authController.authenticate = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization; // Bearer {token}
    if (!tokenString) {
      throw new Error("Invalid token");
    }
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error("Invalid token");
      }
      req.userId = payload._id;
    });

    next();
  } catch (error) {
    res.status(400).json({ status: "FAIL", message: error.message });
  }
};
module.exports = authController;
