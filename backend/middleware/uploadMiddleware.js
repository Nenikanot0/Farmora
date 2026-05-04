import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,uploadDir);  //destination folder
    },
    filename: (req,file,cb) => {
        cb(null,`${Date.now()}-${file.originalname}`); // to prevent collision of names
    }
});

const fileFilter = (req,file,cb) => {
    const allowedTypes= /jpeg|jpg|png/;

    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase()); //check if the extension matches with the valid types

    const mimeType= allowedTypes.test(file.mimetype); //so file standard so no .exe virus renamed as .jpg processes

    if(extName && mimeType){
        cb(null,true)
    }else{
        cb(new Error("Only jpeg,jpg and png allowed"));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter
});

export default upload;