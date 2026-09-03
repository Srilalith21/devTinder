const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const path = require("path");
require("dotenv").config(path.join(__dirname, "../.env"));

async function authenticateUser(req, res, next) {
  try {
    const cookie = req?.cookies;

    // check for valid cookie
    if (!cookie) throw new Error("Authentication failed please login back");
    // Decoding the token
    const decodedData = await jwt.verify(cookie.token, process.env.SECRET_KEY);

    const userId = decodedData;
    if (!userId) throw new Error("User Not Found");
    const userData = await User.findById({ _id: userId });
    // check if the user existance in the database
    if (!userData) throw new Error("User Not Found");
    req.USER_DATA = userData;
  } catch (err) {
    return res.status(400).send(`${err.message}`);
  }
  next();
}

module.exports = { authenticateUser };
