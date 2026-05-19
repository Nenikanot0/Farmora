import marketPrices from "../data/marketPrice.js";
import { generateSellAdvice } from "../utils/marketAIService.js";

const matchCrop = (itemCrop, searchCrop) => 
    itemCrop && searchCrop && itemCrop.toLowerCase() === searchCrop.toLowerCase();


export const getMarketPricesByCrop = async (req, res) => {
    try {
        const { crop } = req.params;
        const prices = marketPrices
            .filter(item => matchCrop(item.crop, crop))
            .sort((a, b) => b.modalPrice - a.modalPrice);

        res.status(200).json(prices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBestMarketForCrop = async (req, res) => {
    try {
        const { crop } = req.params;
        const sortedPrices = [...marketPrices].sort((a, b) => b.modalPrice - a.modalPrice);
        const bestMarket = sortedPrices.find(item => matchCrop(item.crop, crop));

        if (!bestMarket) {
            return res.status(404).json({ message: "No market data found" });
        }

        res.status(200).json(bestMarket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCropPriceTrends = async (req, res) => {
    try {
        const { crop } = req.params;
        const trends = marketPrices
            .filter(item => matchCrop(item.crop, crop))
            .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

        res.status(200).json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSellAdvice = async (req, res) => {
    try {
        const { crop } = req.params;
        const sortedPrices = [...marketPrices].sort((a, b) => b.modalPrice - a.modalPrice);
        const bestMarket = sortedPrices.find(item => matchCrop(item.crop, crop));

        if (!bestMarket) {
            return res.status(404).json({ message: "No market data found for this crop" });
        }

        const aiAdvice = await generateSellAdvice(crop, bestMarket);

        res.status(200).json({ crop,bestMarket,aiAdvice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};