const {Router} = require('express');
const multer = require('multer');
const path = require('path');
const imageProcessor = require('./imageProcessor');

// eslint-disable-next-line new-cap
const router = Router();

const storage = multer.diskStorage(
    {destination: 'api/uploads/', filename: filename});

const upload = multer({fileFilter: fileFilter, storage: storage});
const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

router.get('/photo-viewer', (request, response)=>{
  response.sendfile(photoPath);
});

/**
 * @param {Request} request An HTTP request
 * @param {File} file File information
 * @param {Function} callback A callback function
 */
function filename(request, file, callback) {
  callback(null, file.originalname);
};

/**
 * @param {Request} request An HTTP request
 * @param {File} file File information
 * @param {Function} callback A callback function
 */
function fileFilter(request, file, callback) {
  if (file.mimetype!=='image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'));
  } else {
    callback(null, true);
  }
};

router.post('/upload', upload.single('photo'), async (request, response)=>{
  if (request.hasOwnProperty('fileValidationError')) {
    return response.status(400).json({error: request.fileValidationError});
  }
  try {
    await imageProcessor(request.file.filename);
  } catch (err) {
    return response.status(500).json({error: err});
  }
  return response.status(201).json({success: true});
});

module.exports=router;
