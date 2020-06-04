const {Router} = require('express');
const multer = require('multer');

// eslint-disable-next-line new-cap
const router = Router();

const storage = multer.diskStorage(
    {destination: 'api/uploads/', filename: filename});

const upload = multer({fileFilter: fileFilter, storage: storage});

/**
 * @param {*} request An HTTP request
 * @param {*} file File information
 * @param {*} callback A callback function
 */
function filename(request, file, callback) {
  callback(null, file.originalname);
};

/**
 * @param {*} request An HTTP request
 * @param {*} file File information
 * @param {*} callback A callback function
 */
function fileFilter(request, file, callback) {
  if (file.mimetype!=='image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'));
  } else {
    callback(null, true);
  }
};

router.post('/upload', upload.single('photo'), (request, response)=>{
  if (request.hasOwnProperty('fileValidationError')) {
    return response.status(400).json({error: request.fileValidationError});
  }
  return response.status(201).json({success: true});
});

module.exports=router;
