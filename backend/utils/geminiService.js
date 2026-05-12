import {GoogleGenerativeAI} from "@google/generative-ai";


const analyzeCropDisease = async(symptoms) => {
    try{
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);  //started a instance of gemini api service
        
        const model=genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });
        const prompt=`You are an agriculture expert.
                Analyze these crop symptoms: ${symptoms}
                
                IMPORTANT: Return your response ONLY as a valid JSON object with the following keys:
                {
                  "diseaseName": "string",
                  "causes": ["list", "of", "strings"],
                  "treatment": ["list", "of", "strings"],
                  "prevention": ["list", "of", "strings"],
                  "expertNote": "short friendly summary"
                }
                Do not include any markdown formatting like \`\`\`json.`;
                
        const result=await model.generateContent(prompt);
        let responseText=await result.response.text();
        // return response.text();
        responseText = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // Extract JSON safely
        const firstChar = responseText.indexOf("{");
        const lastChar = responseText.lastIndexOf("}");

        if (firstChar === -1 || lastChar === -1) {
            throw new Error("AI did not return valid JSON");
        }

        const jsonString = responseText.substring(firstChar, lastChar + 1);

        return JSON.parse(jsonString);

    } catch (error){
        throw new Error("AI analysis failed: " + error.message);
    }
}
export default analyzeCropDisease;