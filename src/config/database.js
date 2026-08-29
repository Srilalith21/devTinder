const path = require("path");
const dns = require("node:dns");
const mongoose = require("mongoose");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// config Dotenv
require("dotenv").config(path.join(__dirname, ".env"));

const uri = process.env.MONGO_URI;

async function connectToDatabase() {
  return await mongoose.connect(uri);
}

module.exports = { connectToDatabase };
