const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "moderator", "user"], default: "user" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  resetToken: String,
});

module.exports = mongoose.model("User", userSchema);
