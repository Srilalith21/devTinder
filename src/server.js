const express = require("express");
const { connectToDatabase } = require("./config/database");
const User = require("./models/user.model");
const validate = require("./utils/validate");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const generator = require("./utils/tokengenerator");
const authenticate = require("../src/middlewares/auth.middleware");
const mongoose = require("mongoose");
/**
 * Router Files import
 */
const authRouter = require("./routes/auth.router");
const profileRouter = require("./routes/profile.router");
/**
 * Config Dotenv
 */
require("dotenv").config();

/**
 * Body Parser and cookie parser Middleware
 */
app.use(express.json());
app.use(cookieParser());

/**
 * Mounting the route files
 */
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

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
    mongoose.disconnect();
  });
