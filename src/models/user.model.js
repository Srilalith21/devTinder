const mongoose = require("mongoose");
const validator = require("validator");

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
};

const userSchema = new mongoose.Schema(USER_STRUCTURE, { timestamps: true });
const User = mongoose.model("users", userSchema);
module.exports = User;
