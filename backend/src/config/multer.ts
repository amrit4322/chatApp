import multer from "multer";
import { Request } from "express";
import path from "path";

const destinationDirectory = path.join(__dirname, "../uploads");
console.log("path is ", destinationDirectory);
// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: Function
  ) {
    console.log("testing in");
    cb(null, destinationDirectory); // Destination folder for storing uploaded files
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    const originalname = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + originalname); // Naming convention for uploaded files
  },
});

// Multer file filter function
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check if the uploaded file is an image
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    // Reject the file if it's not an image
    return cb(new Error("Only image files are allowed"));
  }
  // Accept the file if it passes the filter
  cb(null, true);
};
// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

export default upload;
