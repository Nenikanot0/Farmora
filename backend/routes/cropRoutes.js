import express from 'express';
import { uploadCropImage, analyzeSymptoms, getMyCropReports } from '../controllers/cropController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST: http://localhost:5000/api/crop/upload
router.post("/upload", protect, upload.single("cropImage"), uploadCropImage);

// POST: http://localhost:5000/api/crop/analyze
router.post("/analyze", protect, upload.single("cropImage"), analyzeSymptoms);

// GET: http://localhost:5000/api/crop/my-reports
router.get("/my-reports", protect, getMyCropReports);

export default router;