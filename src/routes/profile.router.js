const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const validate = require("../utils/validate");
const { authenticateUser } = require("../middlewares/auth.middleware");
const path = require("path");

const router = express.Router();

/**
 * Config Dotenv
 */
require("dotenv").config(path.join(__dirname, "../../.env"));

router.get("/view", authenticateUser, (req, res) => {
  try {
    if (!req.USER_DATA) throw new Error("No results found");

    res.status(200).send({
      status: true,
      profile: req?.USER_DATA,
    });
  } catch (error) {
    res.status(401).send(`${error.message}`);
  }
});

router.patch("/edit", authenticateUser, async (req, res) => {
  /** Approach
   * 1.Validate the incomming request body
   * 2.Update the user by the the incomming request fields
   * 3.Acknowledge the user
   */
  try {
    validate.validateEditData(req);

    const user = req.USER_DATA;
    const req_data = req?.body;

    Object.keys(req_data).forEach((key) => (user[key] = req_data[key]));
    const updatedUser = await user.save();

    res.send({
      message: "Successfuly updated",
      profile: updatedUser,
    });
  } catch (error) {
    res.status(400).send(`Update Failed ${error.message}`);
  }
});

router.patch("/password/update", authenticateUser, async (req, res) => {
  /**
   *
   * Update password sequence
   * 1. check wheather the current password matches the password hash in db
   * 2. if Yes proceed to create new password
   */
  try {
    validate.validatePasswordUpdateFields(req);

    const { currentPassword, newPassword } = req?.body;

    const user = req.USER_DATA;
    const isPasswordMatched = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatched) throw new Error("current password not matched");

    if (currentPassword === newPassword)
      throw new Error("current password and new password cannot be same");

    const newPasswordHash = await bcrypt.hash(
      newPassword,
      process.env.SECRET_KEY,
    );

    if (!newPasswordHash) res.status(500).send("new password hash not created");

    user.password = newPasswordHash;

    const updatedUser = await user.save();

    res.status(200).send({
      status: "success",
      message: "Password updated successfully.",
    });
  } catch (error) {
    res.status(400).send(`Password update failed : ${error.message}`);
  }
});

router.patch("/password/forgotpassword", (req, res) => {
  res.send("TODO");
});

module.exports = router;
