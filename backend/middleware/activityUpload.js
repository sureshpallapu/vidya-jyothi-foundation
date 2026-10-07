const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*
|--------------------------------------------------------------------------
| UPLOAD DIRECTORY
|--------------------------------------------------------------------------
*/

const uploadDirectory = path.join(
  __dirname,
  "../uploads/activities"
);

/*
|--------------------------------------------------------------------------
| CREATE DIRECTORY
|--------------------------------------------------------------------------
*/

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

/*
|--------------------------------------------------------------------------
| STORAGE
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const originalName = path
      .basename(file.originalname, extension);

    const safeName = originalName
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);

    const filename =
      `${Date.now()}-${safeName || "activity"}${extension}`;

    cb(null, filename);
  },
});

/*
|--------------------------------------------------------------------------
| FILE FILTER
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.mimetype)) {

    return cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

/*
|--------------------------------------------------------------------------
| MULTER
|--------------------------------------------------------------------------
*/

const activityUpload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

});

module.exports = activityUpload;