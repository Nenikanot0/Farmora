import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model=genAI.getGenerativeModel({model:"gemini-2.5-flash"});

export const generateWeatherAdvice=async(weatherData,crop,stage) => {  //weather data fetched from api
    try{

        const prompt = `
            Act as a hyper-local agricultural scientist.
            
            Location Context: 
            - The farmer is in/near: ${weatherData.location}
            - Crop: ${crop}
            - Growth Stage: ${stage}

            Current Weather Conditions at ${weatherData.location}:
            - Temperature: ${weatherData.temperature}°C
            - Humidity: ${weatherData.humidity}%
            - Condition: ${weatherData.weather}
            - Wind Speed: ${weatherData.windSpeed} m/s

            Task:
            Provide a localized agricultural analysis for a farmer growing ${crop} at the ${stage} stage.

            Structure your response exactly like this:
            1. **Disease Risk Score**: [Low/Moderate/High] based on current humidity and temp.
            2. **Local Risks**: Identify specific threats (e.g., fungal, pests, or water stress) relevant to the ${stage} stage.
            3. **Actionable Steps**: 3 clear, simple steps the farmer should take in the next 24-48 hours.
            4. **Stage-Specific Precaution**: One critical warning specific to the ${stage} of ${crop}.

            Tone: Professional and short yet very simple. Use terms a local farmer understands. Keep it concise.
        `;
        const result = await model.generateContent(prompt);
        return result.response.text();

    }catch(error){
        throw new Error("AI weather advice failed: " + error.message);
    }
}