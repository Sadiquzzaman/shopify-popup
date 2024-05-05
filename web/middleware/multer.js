import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/quicktime",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type."), false);
  }
};

const maxSize = 100 * 1024;

const fileLimits = {
  fileSize: maxSize,
  files: 1,
  fileSize: maxSize,
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: fileLimits,
});

export { upload };
