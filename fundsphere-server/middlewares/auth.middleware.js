const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User Not Found" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: "Invalid token or expired" });
  }
};

module.exports = { authMiddleware };
