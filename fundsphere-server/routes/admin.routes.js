const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  changeUserRole,
  activateAccount,
  deactivateAccountByAdmin,
  deleteUsersByAdmin,
  deleteUserById
} = require("../controllers/admin.controller");
const {
  deleteUserValidation,
  runValidation,
} = require("../middlewares/validator.middleware");
const limitRateRequest = require("../middlewares/limiter.middleware");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");

router.use(authMiddleware, roleMiddleware(["admin", "moderator"]));

router.get("/users", limitRateRequest(1, 5), getAllUsers);
router.patch(
  "/:userId/role",
  limitRateRequest(10, 1, "Role already changed. Please wait 10 minutes."),
  changeUserRole
);
router.patch("/:userId/activate", activateAccount);
router.patch("/:userId/deactivate", deactivateAccountByAdmin);
router.delete("/delete-users", deleteUserValidation, runValidation, deleteUsersByAdmin);
router.delete("/:userId/delete", deleteUserById);

module.exports = router;
