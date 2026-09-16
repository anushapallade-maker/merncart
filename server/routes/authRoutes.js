// routes/authRoutes.js
// Handles everything related to signup/login.

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router(); // a mini, separate app just for auth-related URLs

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic check: did they actually send everything we need?
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // 2. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Scramble (hash) the password before saving — never store plain text
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new user using our User model from Day 3
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    });

    await newUser.save(); // actually writes it into MongoDB

    // 5. Send back a success response (never send the password back, even hashed)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;