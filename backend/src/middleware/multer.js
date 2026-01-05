const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: [
      "jpeg", "png", "jpg",
      "pdf", "doc", "docx",
      "odt", "ods", "xls", "xlsx",
    ],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

module.exports = upload;
