const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config(path.join(__dirname, "../.env"));

const USER_STRUCTURE = {
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: function (email) {
      if (!validator.isEmail(email)) {
        throw new Error(`Email '${email}' is not valid`);
      }
    },
  },
  password: {
    required: true,
    type: String,
    validate: (password) => {
      if (!validator.isStrongPassword(password)) {
        throw new Error(
          `Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and symbol.`,
        );
      }
    },
  },
  age: {
    type: Number,
    validate: (age) => {
      if (age < 18) {
        throw new Error("Age must be greater than 18");
      } else {
        return true;
      }
    },
  },
  gender: {
    type: String,
    validate: (v) => {
      if (!["male", "female", "other"].includes(v)) {
        throw new Error(
          `Gender '${v}' must be one of these (male,female,other)`,
        );
      }
    },
  },
  skills: { type: [String] },
  phone: { type: Number },
  about: { type: String, default: "This is default about!" },
  photoUrl: {
    type: String,
    validate: (value) => {
      if (!validator.isURL(value)) {
        throw new Error("please provide valid photo URL");
      }
    },
  },
};

const userSchema = new mongoose.Schema(USER_STRUCTURE, { timestamps: true });

/**
 * Mongoose Schema methods
 */

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(user._id.toString(), process.env.SECRET_KEY);
  if (!token)
    throw new Error("Authentication failed. Please check your credentials.");
  return token;
};

userSchema.methods.validatePassword = async function (plainPassword) {
  const isValidPassword = await bcrypt.compare(plainPassword, this.password);
  return isValidPassword;
};

const User = mongoose.model("users", userSchema);
module.exports = User;
