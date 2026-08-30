// models/User.js
// This defines what every "User" document will look like in MongoDB.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can share the same email
    },
    password: {
      type: String,
      required: true, // this will store the HASHED password, not plain text
    },
    role: {
      type: String,
      enum: ["customer", "admin"], // only these two values are allowed
      default: "customer", // if not specified, assume normal customer
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);