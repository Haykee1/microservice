const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const users = require("../model/user");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: `welcome, ${req.user.username}` });
});

//register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await users.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new users({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await users.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, process.env.JWT_KEYS, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
