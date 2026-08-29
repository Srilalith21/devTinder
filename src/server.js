const express = require("express");
const { connectToDatabase } = require("./config/database");
const User = require("./models/user.model");
const mongoose = require("mongoose");
const validate = require("./utils/validate");
const app = express();
const bcrypt = require("bcrypt");

/**
 * Config Dotenv
 */
require("dotenv").congig();

/**
 * Body Parser Middleware
 */
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.post("/signin", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate the request body
    validate.validateSignIn(req);

    // Encrypt the password before saving to the database
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password Hash:", passwordHash);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const insertedUser = await user.save();
    res.status(201).send(insertedUser);
  } catch (err) {
    res.status(500).send(`Insertion Failed: ${err.message}`);
  }
});

// LOGIN request
app.post("/login", async (req, res) => {
  const { email, password } = req?.body;

  try {
    validate.validateLogin(req); // validate wheather the fields exists

    const userData = await User.findOne({ email: email });

    if (!userData) throw new Error("Invalid Credentials");

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) throw new Error("Invalid Credentials");

    res.send({
      status: true,
      verified: ["email", "password"],
      message: "Login Successful",
    });
  } catch (err) {
    res.status(400).send(`Login Failed : ${err.message}`);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const user_id = req.params?.userId;
  const update = req?.body;

  try {
    // Validate the update request
    validate.validateUpdate(req);

    const updatedUser = await User.findByIdAndUpdate(user_id, update, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send(`Update Failed: ${err.message}`);
  }
});

connectToDatabase()
  .then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT, () => {
      console.log("Server listening at port 5500");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });
