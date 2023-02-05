const multer = require('multer');
const multerConfig = require('../config/multerConfig');

const upload = multer(multerConfig).single('file');

module.exports = upload;
