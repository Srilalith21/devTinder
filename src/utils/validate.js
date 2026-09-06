const validator = require("validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config(path.join(__dirname, "../.env"));

/**
 * Validates the incoming request for the login route
 */
const validateLogin = (req, res, next) => {
  try {
    const { email, password } = req?.body;
    if (!email) throw new Error(`email field not present`);
    if (!password) throw new Error(`password field not present`);

    const isEmail = validator.isEmail(email);
    const isPassword = validator.isEmpty(password);

    if (!isEmail) throw new Error("please enter valid email id");
    if (isPassword) throw new Error("password field cannot be empty");
  } catch (error) {
    res.status(400).send(`Login Failed : ${error.message}`);
  }
  next();
};

const validateSignIn = (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req?.body;

    // Validation Constraints
    if (!firstName) {
      throw new Error("First name and last name are required");
    }
    if (validator.isEmpty(firstName)) {
      throw new Error("First name cannot be Empty");
    }
    if (!email) {
      throw new Error("Email is required");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Please enter valid email");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error(
        `Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and symbol.`,
      );
    }
  } catch (err) {
    res.status(400).send(`Validation Failed : ${err.message}`);
  }
  next();
};

const validateEditData = (req) => {
  const update = req?.body;

  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "phone",
    "skills",
    "about",
  ];
  if (!Object.keys(update).every((key) => ALLOWED_UPDATES.includes(key))) {
    throw new Error(
      `Invalid update keys. Allowed keys are: ${ALLOWED_UPDATES.join(", ")}`,
    );
  }

  Object.values(update).forEach((value) => {
    if (!value) {
      throw new Error("Update values cannot be empty");
    }
  });

  if (update.skills?.length > 10)
    throw new Error("Skills cannot be more than 10");
};

const validatePasswordUpdateFields = (req) => {
  const ALLOWED_FIELDS = ["currentPassword", "newPassword"];

  const { currentPassword, newPassword } = req?.body;
  if (!currentPassword) throw new Error("Required currentPassword field");
  if (!newPassword) throw new Error("Required newPassword field");

  if (Object.keys(req.body).length > 2)
    throw new Error(
      `Extra Fields not allowed appart from ${ALLOWED_FIELDS.join(",")}`,
    );

  if (validator.isEmpty(currentPassword))
    throw new Error("curretPassword field is empty");
  if (validarot.isEmpty(newPassword))
    throw new Error("newPassword field is empty");
};

module.exports = {
  validateSignIn,
  validateEditData,
  validateLogin,
  validatePasswordUpdateFields,
};
