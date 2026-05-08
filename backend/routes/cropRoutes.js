import express from 'express';
import { uploadCropImage, analyzeSymptoms, getMyCropReports } from '../controllers/cropController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("cropImage"), uploadCropImage);

router.post("/analyze", protect, upload.single("cropImage"), analyzeSymptoms);

router.get("/my-reports", protect, getMyCropReports);

export default router;