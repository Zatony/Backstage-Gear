import dotenv from "dotenv";
import multer from "multer";
import util from "util";
import config from "../config/config";
import path from "path";

dotenv.config();


const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, config.baseDir + config.uploadDir);
    }
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const allowedMimeTypes = ["image/jpeg", "image/png"];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Csak JPG és PNG fájlok tölthetők fel!"));
    }
};

const uploadFile = multer({
    storage: storage,
    limits: {fileSize: config.maxSize},
    fileFilter: fileFilter
}).single("file");

const uploadFiles = multer({
    storage: storage,
    limits: {fileSize: config.maxSize},
    fileFilter: fileFilter
}).array("files", 10);


export const uploadMiddleware = util.promisify(uploadFile);
export const uploadMiddlewareMultiple = util.promisify(uploadFiles);