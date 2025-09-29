const multer = require("multer");
const sanitizeFileName = require("../utils/sanitize-name");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/png", "video/mp4"].includes(file.mimetype)) {
      return cb(new Error("file type not supported"));
    }
    cb(null, true);
  },
  filename: (req, file, cb) => {
    cb(null, sanitizeFileName(file.originalname));
  },
});

module.exports = upload;
