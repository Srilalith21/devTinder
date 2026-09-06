const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const path = require("path");
require("dotenv").config(path.join(__dirname, "../.env"));

async function authenticateUser(req, res, next) {
  /*** This function checks wheather the user is valid or not
   * vheck the cookie in from the request
   * decode the token
   * check if the user exists in the database
   */

  try {
    const token = req.cookies?.token;

    if (!token) throw new Error("Authentication failed please login back");

    const decodedData = await jwt.verify(token, process.env.SECRET_KEY);

    const userId = decodedData;
    if (!userId) throw new Error("User Not Found");

    const userData = await User.findById({ _id: userId });
    if (!userData) throw new Error("User Not Found");

    req.USER_DATA = userData;
  } catch (err) {
    return res.status(400).send(`${err.message}`);
  }
  next();
}

module.exports = { authenticateUser };
