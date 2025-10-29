const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const isAdmin = require("../utils/role");

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ email, username, password });
    await user.save();

    const token = generateToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({ message: "User registered successfully", user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Login successful", user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};  
exports.logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logout successful" });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};