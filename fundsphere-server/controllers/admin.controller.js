const User = require("../models/user.model");
const Campaign = require("../models/campaign.model");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .sort({ role: -1, createdAt: -1 })
      .select("-password");

    res.json({ total: users.length, users });
  } catch (error) {
    next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "moderator"].includes(role))
      return res
        .status(400)
        .json({ msg: "Invalid role. Only 'user' or 'moderator' allowed." });

    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ msg: "Cannot change role of an admin" });

    user.role = role;
    await user.save();

    res.json({ msg: `User role updated to '${role}'`, user });
  } catch (error) {
    next(error);
  }
};

const activateAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(
      userId,
      { status: "Active" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User account activated successfully", user });
  } catch (error) {
    next(error);
  }
};

const deactivateAccountByAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ msg: "Cannot deactivate an admin" });

    user.status = "Inactive";
    await user.save();

    res.json({ msg: "User account deactivated successfully", user });
  } catch (error) {
    next(error);
  }
};

const deleteUsersByAdmin = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: "No users selected" });
    }

    const users = await User.Find({
      _id: { $in: ids },
      role: { $ne: "admin" },
    });

    if (!users.length)
      return res.status(404).json({ error: "No deletable users found" });

    const userIds = users.map((u) => u._id);

    // Delete linked campaigns
    await Campaign.deleteMany({ createdBy: { $in: userIds } });

    const result = await User.deleteMany({ _id: { $in: userIds } });

    res.json({
      msg: `Deleted ${result.deletedCount} ${
        result.deletedCount === 1 ? "user" : "users"
      } and their campaigns successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ msg: "Cannot delete an admin" });

    await Campaign.deleteMany({ createdBy: user._id });

    await user.deleteOne();

    res.json({
      msg: `User ${user.username} and their campaigns deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  changeUserRole,
  activateAccount,
  deactivateAccountByAdmin,
  deleteUsersByAdmin,
  deleteUserById,
};
