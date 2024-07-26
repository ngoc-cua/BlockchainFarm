const multer = require('multer');
const storage = multer.memoryStorage(); // Store the image in memory for further processing
const upload = multer({ storage: storage });

module.exports = upload;
