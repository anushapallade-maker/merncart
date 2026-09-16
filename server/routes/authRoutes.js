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



const jwt = require("jsonwebtoken"); // add this to your requires at the top

// @route   POST /api/auth/login
// @desc    Log in an existing user and return a JWT token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic check
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Deliberately vague message — don't reveal whether email or password was wrong
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Compare the submitted password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4. Create the JWT token ("wristband")
    const token = jwt.sign(
      { id: user._id, role: user.role }, // data stored inside the token
      process.env.JWT_SECRET,            // secret key used to sign it (kept in .env)
      { expiresIn: "7d" }                // token becomes invalid after 7 days
    );

    // 5. Send the token back to the client
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;