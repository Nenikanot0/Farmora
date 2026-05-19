import express from "express";
import {getMarketPricesByCrop,getBestMarketForCrop,getCropPriceTrends,getSellAdvice} from "../controllers/marketController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/prices/:crop",protect,getMarketPricesByCrop);

router.get("/best-market/:crop",protect,getBestMarketForCrop);

router.get("/trends/:crop",protect,getCropPriceTrends);

router.get("/sell-advice/:crop",protect,getSellAdvice);

export default router;