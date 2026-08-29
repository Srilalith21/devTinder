const validator = require("validator");

const validateSignIn = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }
  if (!email) {
    throw new Error("Email is required");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      `Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and symbol.`,
    );
  }
};

const validateUpdate = (req) => {
  const update = req?.body;

  const ALLOWED_UPDATES = ["firstName", "lastName", "age", "phone", "skills"];
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

const validateLogin = (req) => {
  const { email, password } = req?.body;
  if (!email || email == "") throw new Error(`email field not present`);
  if (!password || password == "")
    throw new Error(`password field not present`);
};

module.exports = { validateSignIn, validateUpdate, validateLogin };
