import express from 'express';
import {getDashboardStats,getTopRiskyCrops,getCityRiskTrends,getMonthlyRiskTrends,getHighRiskAlerts,getDiseaseCategoryAnalytics,getDiseaseHotspots, getCriticalAlerts} from '../controllers/adminController.js';
import adminOnly from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
const router=express.Router();

router.get("/dashboard",protect,adminOnly,getDashboardStats);
router.get("/top-risky-crops",protect,adminOnly,getTopRiskyCrops);
router.get("/city-risk-trends",protect,adminOnly,getCityRiskTrends);
router.get("/monthly-risk-trends",protect,adminOnly,getMonthlyRiskTrends);
router.get("/high-risk-alerts",protect,adminOnly,getHighRiskAlerts );
router.get("/disease-category-analytics",protect,adminOnly,getDiseaseCategoryAnalytics);
router.get("/disease-hotspots",protect,adminOnly,getDiseaseHotspots);
router.get("/critical-alerts",protect,adminOnly,getCriticalAlerts);

export default router;

