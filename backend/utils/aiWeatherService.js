import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model=genAI.getGenerativeModel({model:"gemini-2.5-flash"});

export const generateWeatherAdvice=async(weatherData) => {  //weather data fetched from api
    try{

        const prompt = `
            Act as a professional agronomist. 
            The current weather <is:></is:>
            - Temperature: ${weatherData.temperature}°C
            - Humidity: ${weatherData.humidity}%
            - Condition: ${weatherData.weather}
            - Wind Speed: ${weatherData.windSpeed} m/s

            Provide 2-3 specific, actionable points of advice for a farmer today. 
            Focus on irrigation, pesticide application, and crop safety. 
            Keep the tone helpful and professional.
        `;
        const result = await model.generateContent(prompt);
        return result.response.text();

    }catch(error){
        throw new Error("AI weather advice failed: " + error.message);
    }
}