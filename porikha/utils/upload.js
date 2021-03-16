const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|PNG|JPG|JPEG)$/)) {
      return cb(new Error('Please provide an image or a pdf!'));
    }
    cb(undefined, true);
  }
});

module.exports = upload;
