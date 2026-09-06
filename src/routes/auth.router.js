/**
 * Eternal Imports
 */
const express = require("express");
const bcrypt = require("bcrypt");

/**
 * Internal Imports
 */
const validate = require("../utils/validate");
const User = require("../models/user.model");

const router = express.Router();

/**
 * /login Route
 */
router.post("/login", validate.validateLogin, async (req, res) => {
  /**
   * -- SEQUENCE FOLLOWED --
   * find the user into the database by email
   * compare the password
   * generate JWT token
   * send cookies to the client
   * send the response
   */
  try {
    const { email, password } = req?.body;
    const user = await User.findOne({ email: email });

    if (!user) throw new Error("Invalid credentials");

    const isValidPassword = user.validatePassword(password);
    if (!isValidPassword) throw new Error("Invalid credentials");

    const token = await user.getJWT();

    res.cookie("token", token, { expires: new Date(Date.now() + 90000) });
    res.send({
      message: "Login Success",
      profile: user,
    });
  } catch (error) {
    res.status(400).send(`Login Failed : ${error.message}`);
  }
});

/**
 * /signup Route
 */
router.post("/signup", validate.validateSignIn, async (req, res) => {
  /**
   * -- SEQUENCE FOLLOWED --
   * hash the password
   * store the data into the database
   */

  try {
    const req_data = req.body;

    const password_hash = await bcrypt.hash(req_data.password, 10); // Bcrypt password

    const user = await User.create({
      firstName: req_data.firstName,
      lastName: req_data?.lastName,
      email: req_data.email,
      password: password_hash,
      age: req_data?.age,
      gender: req_data?.gender,
      phone: req_data?.phone,
      skills: req_data?.skills,
      about: req_data?.about,
    });

    const insertedUser = await user.save();
    if (!insertedUser) {
      throw new Error("Insertion Failed!");
    }
    res.send({
      status: 200,
      message: "Sign up success",
    });
  } catch (error) {
    res.status(400).send(`Sign Up Failed : ${error.message}`);
  }
});

/**
 * /logout Route
 */
router.post("/logout", (req, res) => {
  /**
   * Remove the cookies from client browser
   */
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout succesful");
});

module.exports = router;
