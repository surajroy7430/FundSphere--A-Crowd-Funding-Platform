const User = require("../models/user.model");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updates).select(
      "-password"
    );
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User profile updated", user });
  } catch (error) {
    next(error);
  }
};

const deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { status: "Inactive" },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Your account has been deactivated", user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, deactivateAccount };
