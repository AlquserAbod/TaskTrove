const { getStorage } = require('firebase/storage');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Multer configuration for handling file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads/images/avatars/');
//     },
//     filename: function (req, file, cb) {
//         const timestamp = Date.now();

//         const randomString = uuidv4().slice(0, 16); // Adjust the length as needed

//         const fileExtension = file.originalname.split('.').pop();

//         const filename = `${timestamp}-${randomString}.${fileExtension}`;

//         cb(null, filename);
//     }
// });
const storage = getStorage()

const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;