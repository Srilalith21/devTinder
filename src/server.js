const express = require("express");
const { connectToDatabase } = require("./config/database");
const User = require("./models/user.model");
const validate = require("./utils/validate");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

/**
 * Config Dotenv
 */
require("dotenv").config();

/**
 * Body Parser and cookie parser Middleware
 */
app.use(express.json());
app.use(cookieParser());

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
    // If Email is valid check the password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) throw new Error("Invalid Credentials");

    // Integrating simple auth system with known token value
    res.cookie("token", "sampletokendfromserver"); // This is for learning purpose only
    res.send({
      status: true,
      verified: ["email", "password"],
      message: "Login Successful",
    });
  } catch (err) {
    res.status(400).send(`Login Failed : ${err.message}`);
  }
});

app.get("/profile", (req, res) => {
  try {
    // Validate the (SAMPLE JWT TOKEN)
    validate.validateIncomingCookie(req);
    res.status(200).send({
      status: true,
      token: "valid",
      profiles: [
        { name: "coderSri", age: 20 },
        { name: "sri", age: 20 },
      ],
    });
  } catch (error) {
    res.status(401).send(`${error.message}`);
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
