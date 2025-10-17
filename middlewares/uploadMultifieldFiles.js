const multer = require("multer");
/**
 * Use disk storage by default. When running on a serverless/read-only
 * environment (Vercel, Now, etc.) we switch to memoryStorage to avoid
 * writing files to the read-only `/public` folder which causes EROFS.
 *
 * If you deploy to a serverless platform you should persist files to
 * external storage (S3, Cloudinary, Vercel Blob) using the buffers
 * available on req.files when memoryStorage is enabled.
 */
const uploadMuiltiFieldFiles = (destination) => {
  const isServerless = !!(process.env.VERCEL || process.env.NOW || process.env.IS_SERVERLESS);
  const storage = isServerless
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, res, cb) => {
          cb(null, destination);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/svg" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/gif"||
      file.mimetype === "application/pdf" ||  
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    ) {
      cb(null, true);
    } else {
      const error = new Error("Invalid file type");
      error.status = 400;
      cb(error);
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 2024 * 2,
    },
    fileFilter: fileFilter,
  });

  return function (req, res, next) {
    upload.fields([
      { name: "cover" },
      { name: "profile" },
      { name: "update",maxCount:10 },
      { name: "investDoc",maxCount:10 },
    ])(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(400).send({ error: "File upload error" });
      } else if (err) {
        return res.status(400).send({ error: err.message });
      }
      //   req.filePath = req.file.path;
      next();
    });
  };
};
module.exports =  uploadMuiltiFieldFiles
