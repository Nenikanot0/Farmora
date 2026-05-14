import analyzeCropDisease from "../utils/geminiService.js";
import CropReport from "../models/CropReport.js"; 

export const uploadCropImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        return res.status(200).json({
            message: "Image uploaded successfully",
            imagePath: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const analyzeSymptoms = async (req, res) => {
    try {
        const { cropType, symptoms, language = "English" } = req.body;

        if (!cropType?.trim() || !symptoms?.trim()) {
            return res.status(400).json({
                message: "Please provide crop type and symptoms"
            });
        }

        const analysis = await analyzeCropDisease(symptoms, language);

        const report = await CropReport.create({
            userId: req.user, 
            cropType,
            symptoms,
            diseasePrediction: analysis, 
            suggestion: "Follow the treatment tips provided in the analysis.",
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });

        return res.status(200).json({
            message: "Crop analysis completed",
            report 
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getMyCropReports = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const reports = await CropReport.find({ userId: req.user }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            count: reports.length,
            reports
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};