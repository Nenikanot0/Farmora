import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

export const generateSellAdvice = async (
    crop,
    marketData
) => {
    try {
        const prompt = `
You are an agricultural market advisor.

Crop: ${crop}

Current best market:
Market Name: ${marketData.market}
District: ${marketData.district}
State: ${marketData.state}

Price Data:
Min Price: ₹${marketData.minPrice}
Max Price: ₹${marketData.maxPrice}
Modal Price: ₹${marketData.modalPrice}
Arrival Quantity: ${marketData.arrivalQuantity}

Return ONLY valid JSON:

{
  "decision": "Sell Now or Hold",
  "reason": "short explanation",
  "bestMarket": "market name",
  "priceOutlook": "Bullish or Bearish or Stable"
}
`;

        const result =
            await model.generateContent(
                prompt
            );

        let responseText =
            result.response.text();

        responseText = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(
            responseText
        );

    } catch (error) {
        throw new Error(
            "Market AI advice failed: " +
            error.message
        );
    }
};