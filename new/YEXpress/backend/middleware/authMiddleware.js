const jwt = require("jsonwebtoken");
const User = require("../models/user");


const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    if (!user)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = protect;

