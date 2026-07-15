const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*
|--------------------------------------------------------------------------
| Storage Configuration
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const uploadPath = path.join(

      __dirname,

      "..",

      "uploads",

      "scholarship",

      req.params.id

    );

    fs.mkdirSync(uploadPath, {

      recursive: true,

    });

    cb(null, uploadPath);

  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(file.originalname);

    cb(

      null,

      `${file.fieldname}-${Date.now()}${extension}`

    );

  },

});

/*
|--------------------------------------------------------------------------
| Allowed File Types
|--------------------------------------------------------------------------
*/

const allowedMimeTypes = [

  "image/jpeg",

  "image/jpg",

  "image/png",

  "application/pdf",

];

const fileFilter = (req, file, cb) => {

  if (

    allowedMimeTypes.includes(file.mimetype)

  ) {

    return cb(null, true);

  }

  return cb(

    new Error(

      "Only JPG, JPEG, PNG and PDF files are allowed."

    )

  );

};

/*
|--------------------------------------------------------------------------
| Upload Configuration
|--------------------------------------------------------------------------
*/

const upload = multer({

  storage,

  fileFilter,

  limits: {

    fileSize: 10 * 1024 * 1024,

  },

});

module.exports = upload;