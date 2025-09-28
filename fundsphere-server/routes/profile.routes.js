const express = require("express");
const router = express.Router();
const limitRateRequest = require("../middlewares/limiter.middleware");
const {
  getProfile,
  updateProfile,
  deactivateAccount,
} = require("../controllers/profile.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  profileValidation,
  runValidation,
} = require("../middlewares/validator.middleware");

router.use(authMiddleware);

router.get("/", getProfile);
router.put(
  "/",
  limitRateRequest(1, 5),
  profileValidation,
  runValidation,
  updateProfile
);
router.patch("/deactivate", deactivateAccount);

module.exports = router;
