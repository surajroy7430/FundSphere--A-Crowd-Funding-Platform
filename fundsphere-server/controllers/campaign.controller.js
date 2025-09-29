const Campaign = require("../models/campaign.model");
const sanitizeFileName = require("../utils/sanitize-name");
const uploadFileToS3 = require("../services/s3");

const createCampaign = async (req, res, next) => {
  try {
    const { title, description, goalAmount, milestones, deadline } = req.body;

    const campaign = new Campaign({
      title,
      description,
      goalAmount,
      milestones,
      deadline,
      createdBy: req.user.id,
    });

    await campaign.save();
    res.status(201).json({ msg: "Campaign created", campaign });
  } catch (error) {
    next(error);
  }
};

const uploadMedia = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    const urls = [];
    for (let file of req.files) {
      file.originalname = sanitizeFileName(file.originalname);
      const url = await uploadFileToS3(file);
      urls.push(url);
    }

    campaign.media.push(...urls);
    await campaign.save();

    res.json({ msg: "Media uploaded", media: campaign.media });
  } catch (error) {
    next(error);
  }
};

const getCampaignPreview = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
};

const publishCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, {
      status: "published",
    });
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
};

const getActivePublishedCampaigns = async (req, res, next) => {
  try {
    const now = new Date();
    const campaigns = await Campaign.find({
      status: "published",
      $or: [{ deadline: { $gte: now } }, { deadline: null }],
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "createdBy",
        select: "username email role _id",
      });

    res.json({ campaigns });
  } catch (error) {
    next(error);
  }
};

const getCampaignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findOne({
      _id: id,
      status: "published",
    }).populate({
      path: "createdBy",
      select: "username email role _id",
    });

    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
};

const getUserCampaigns = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const campaigns = await Campaign.find({
      createdBy: userId,
      status: "published",
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "createdBy",
        select: "username email role _id",
      });

    res.json({ campaigns });
  } catch (error) {
    next(error);
  }
};

const getUserCampaignById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const campaign = await Campaign.findOne({
      _id: id,
      createdBy: userId,
      status: "published",
    }).populate({
      path: "createdBy",
      select: "username email role _id",
    });

    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
};

const deleteDraftCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.deleteMany({ status: "draft" });

    res.json({
      msg: `Deleted ${campaigns.deletedCount} draft campaigns successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCampaign,
  uploadMedia,
  getCampaignPreview,
  publishCampaign,
  getActivePublishedCampaigns,
  getCampaignById,
  getUserCampaigns,
  getUserCampaignById,
  deleteDraftCampaigns,
};
