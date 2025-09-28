const express = require("express");
const router = express.Router();
const limitRateRequest = require("../middlewares/limiter.middleware");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const {
  registerValidator,
  loginValidator,
  passwordValidator,
  runValidation,
} = require("../middlewares/validator.middleware");

router.post("/register", registerValidator, runValidation, register);
router.post(
  "/login",
  limitRateRequest(1, 3, "Too many login attemps. Try again later."),
  loginValidator,
  runValidation,
  login
);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
});

router.post(
  "/forgot-password",
  limitRateRequest(
    10,
    1,
    "Password reset link already sent. Please wait 10 minutes."
  ),
  forgotPassword
);
router.post("/reset-password", passwordValidator, runValidation, resetPassword);

module.exports = router;
