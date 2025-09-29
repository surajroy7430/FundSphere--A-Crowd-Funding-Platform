const { Router } = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  createCampaign,
  uploadMedia,
  getCampaignPreview,
  publishCampaign,
  getActivePublishedCampaigns,
  getCampaignById,
  getUserCampaigns,
  getUserCampaignById,
  deleteDraftCampaigns,
} = require("../controllers/campaign.controller");

const router = Router();

router.use(authMiddleware);

router.post("/", createCampaign);
router.post("/:id/media", upload.array("media"), uploadMedia);
router.get("/:id/preview", getCampaignPreview);
router.patch("/:id/publish", publishCampaign);

router.get("/published", getActivePublishedCampaigns);
router.get("/published/:id", getCampaignById);
router.get("/user/published", getUserCampaigns);
router.get("/user/published/:id", getUserCampaignById);

router.delete("/drafts", roleMiddleware(["admin"]), deleteDraftCampaigns);

module.exports = router;
