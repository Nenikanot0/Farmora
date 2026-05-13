import {GoogleGenerativeAI} from "@google/generative-ai";


const analyzeCropDisease = async(symptoms,language) => {
    try{
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);  //started a instance of gemini api service
        
        const model=genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });
        const prompt=`You are an agriculture expert.
                Crop symptoms to analyze: ${symptoms}

                Write all human-readable text (disease name, list items, expert note) in: ${language}.
                Keep JSON keys exactly as below (English). Values must be in ${language}.
                Use short, simple sentences suitable for farmers.

                Return ONLY a valid JSON object with these keys:
                {
                  "diseaseName": "string",
                  "causes": ["string"],
                  "treatment": ["string"],
                  "prevention": ["string"],
                  "expertNote": "string"
                }
                Do not include markdown or code fences like \`\`\`json.`;
                
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