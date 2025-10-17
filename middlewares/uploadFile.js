const multer = require("multer");
/**
 * Switch to memoryStorage when running in serverless/read-only envs
 * (VERCEL, NOW). Persist files externally in those environments.
 */
const uploadFile = (destination) => {
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
    console.log(file);
    if (
      file.mimetype === "image/svg" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/gif"
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
    upload.array("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ error: "File upload error" });
      } else if (err) {
        return res.status(400).send({ error: err.message });
      }
      //   req.filePath = req.file.path;
      next();
    });
  };
};
module.exports = uploadFile;
