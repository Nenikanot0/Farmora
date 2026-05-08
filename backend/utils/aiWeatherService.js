import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model=genAI.getGenerativeModel({model:"gemini-2.5-flash"});

export const generateWeatherAdvice=async(weatherData,crop,stage) => {  //weather data fetched from api
    try{

        const prompt = `
            Act as a hyper-local agricultural scientist.
            
            Context: 
            - Location: ${weatherData.location}
            - Crop: ${crop}
            - Growth Stage: ${stage}
            - Weather: ${weatherData.temperature}°C, ${weatherData.humidity}% humidity, ${weatherData.weather}.
            Task:
            Provide a localized agricultural analysis for a farmer growing ${crop} at the ${stage} stage in ${weatherData.location}.

            Required JSON Structure:
            {
                "riskScore": "Low/Moderate/High",
                "risks": ["Short label (e.g. Weed Competition)", "Short label (e.g. Stem Borer)"],
                "recommendations": ["Actionable step 1", "Actionable step 2"],
                "precaution": "One short warning sentence"
            }

            Tone: Professional and short yet very simple. Use terms a local farmer understands. Keep it concise.
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