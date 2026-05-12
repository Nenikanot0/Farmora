import express from 'express';
import {getMyWeatherReports, getWeather} from "../controllers/weatherController.js";
import { protect } from '../middleware/authMiddleware.js';

const router=express.Router();

router.post("/",protect,getWeather);
router.get("/history",protect,getMyWeatherReports);



export default router;