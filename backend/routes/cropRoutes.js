import express from 'express';
import { uploadCropImage } from '../controllers/cropController.js';
import upload from '../middleware/uploadMiddleware.js';

const router=express.Router();

router.post("/upload",upload.single("cropImage"),uploadCropImage);  // -> middleware -> controller
//                    !-> only permits one file 
export default router;