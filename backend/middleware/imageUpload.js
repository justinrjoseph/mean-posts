const multer = require('multer');

const MIME_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = null;

    if ( !MIME_TYPES[file.mimetype] ) {
      error = new Error('Invalid MIME type');
    }

    cb(error, 'images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPES[file.mimetype];

    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

module.exports = multer({ storage }).single('image');