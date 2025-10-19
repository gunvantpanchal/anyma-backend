const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/svg+xml',
    'image/webp',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/avif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 5 } });

module.exports = function memoryUpload() {
  return upload.fields([
    { name: 'cover' },
    { name: 'profile' },
    { name: 'update', maxCount: 10 },
    { name: 'investDoc', maxCount: 10 },
  ]);
};
