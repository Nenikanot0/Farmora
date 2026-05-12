import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model=genAI.getGenerativeModel({model:"gemini-2.5-flash"});

export const generateWeatherAdvice=async(weatherData,crop,stage,language) => {  //weather data fetched from api
    try{

        const prompt = `
            Act as a hyper-local agricultural scientist.
            Return ONLY a valid JSON object. 

            Context: 
            - Location: ${weatherData.location}
            - Crop: ${crop}
            - Growth Stage: ${stage}
            - Weather: ${weatherData.temperature}°C, ${weatherData.humidity}% humidity, ${weatherData.weather}.

            Task:
            Provide agricultural analysis in the language: ${language}.
            
            Strict Rules:
            1. The JSON KEYS must remain in English as defined below.
            2. The VALUES (content) must be written in ${language}.
            
            Required JSON Structure:
            {
                "riskScore": "Low or Moderate or High (Keep these 3 labels in English)",
                "riskPercentage": number (0-100),
                "diseaseCategory": "Fungal or Pest or Water Stress or Nutrient Deficiency",
                "risks": ["Translate risk here", "Translate risk here"],
                "irrigationAdvice": "Translate advice here",
                "pesticideAdvice": "Translate advice here",
                "cropSafetyAdvice": "Translate advice here"
            }

            Scale: Low (0-39), Moderate (40-69), High (70-100).
            Tone: Simple, professional, and farmer-friendly.
        `;
        
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        responseText = responseText
            .replace(/```json/g, "")  //start of string
            .replace(/```/g, "")      //end of string
            .trim();
 
        const firstChar = responseText.indexOf('{');
        const lastChar = responseText.lastIndexOf('}');
        
        if (firstChar === -1 || lastChar === -1) {
            throw new Error("AI did not return a valid JSON block");
        }

        const jsonString = responseText.substring(firstChar, lastChar + 1); //extracts the info between '{' and '}' only

        return JSON.parse(jsonString);  //converts to json string to object

    }catch(error){
        throw new Error("AI weather advice failed: " + error.message);
    }
}