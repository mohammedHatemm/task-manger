const multer = require("multer")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
   },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)

  },
});
const filleFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(null, false)
  }
};
const upload = multer({
  storage: storage,
  fileFilter: filleFilter,
});

module.exports = upload;
