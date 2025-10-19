const Busboy = require('busboy');
const firebaseStorage = require('../utils/firebaseStorage');

// Middleware: parse multipart form-data and upload files to Firebase Storage
// Attaches req.firebaseFiles: { fieldname: [ { originalname, url, mimetype, size } ] }
module.exports = function firebaseUpload() {
  return async function (req, res, next) {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
      return next();
    }

    const busboy = Busboy({ headers: req.headers });
    req.firebaseFiles = {};
    req.body = req.body || {};

    busboy.on('file', (fieldname, file, filenameOrInfo, encoding, mimetype) => {
      // Support both signatures: (fieldname, file, filename, encoding, mimetype)
      // and newer: (fieldname, file, info) where info = { filename, encoding, mimeType }
      let filename = filenameOrInfo;
      if (filenameOrInfo && typeof filenameOrInfo === 'object') {
        filename = filenameOrInfo.filename || filenameOrInfo.name || 'file';
        encoding = filenameOrInfo.encoding || encoding;
        mimetype = filenameOrInfo.mimeType || filenameOrInfo.mime || mimetype;
      }

      const buffers = [];
      file.on('data', (data) => {
        buffers.push(data);
      });
      file.on('end', async () => {
        const buffer = Buffer.concat(buffers);
        try {
          const uploaded = await firebaseStorage.uploadBufferToFirebase(buffer, String(filename), mimetype);
          req.firebaseFiles[fieldname] = req.firebaseFiles[fieldname] || [];
          req.firebaseFiles[fieldname].push({ originalname: filename, url: uploaded.url, mimetype, size: buffer.length });
          console.log('Firebase uploaded', filename, '->', uploaded.url);
        } catch (err) {
          console.error('Firebase upload failed for', { filename, encoding, mimeType: mimetype }, err);
          // fail the request
          req.firebaseUploadError = err;
        }
      });
    });

    busboy.on('field', (fieldname, val) => {
      // preserve other form fields
      // if a field already exists, convert to array
      if (req.body[fieldname]) {
        if (Array.isArray(req.body[fieldname])) {
          req.body[fieldname].push(val);
        } else {
          req.body[fieldname] = [req.body[fieldname], val];
        }
      } else {
        req.body[fieldname] = val;
      }
    });

    busboy.on('finish', () => {
      if (req.firebaseUploadError) {
        return res.status(500).json({ message: 'File upload failed', error: req.firebaseUploadError.message });
      }
      // make req.files for compatibility with existing controllers
      req.files = req.firebaseFiles;
      next();
    });

    req.pipe(busboy);
  };
};
