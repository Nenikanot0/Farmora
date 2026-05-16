import { generateWeatherAdvice } from "../utils/aiWeatherService.js"; //from gemini
import {getWeatherByCity} from "../utils/weatherService.js"; //get weather of city
import WeatherRiskReport from "../models/WeatherRiskReport.js";
import { sendAlertEmail} from "../utils/emailService.js";
import {sendSMSAlert } from "../utils/smsService.js";

export const getWeather=async(req,res) => {
    try{
        const {village,city,district,crop,stage,language="English"}=req.body;

        const validStages = ["seedling","vegetative","flowering","harvest"];


        if(!village && !district && !city){
            return res.status(400).json({message:"Please provide a village, city, or district name."});
        }
        
        const locations = [
        { value: village, type: "village" },
        { value: city, type: "city" },
        { value: district, type: "district" },
        ];

        let weatherData = null;
        let resolvedAt = "";
        let location = "";

        for (const place of locations) {
        if (!place.value) continue;

        try {
            weatherData = await getWeatherByCity(place.value);
            location = place.value;
            resolvedAt = place.type;
            break;
        } catch {
            // Try next location(input)
        }
        }

        if (!weatherData) {
        throw new Error("Location not recognized by weather service.");
        }

        if(!validStages.includes(stage.toLowerCase())){
            return res.status(400).json({message:"Please provide a correct crop stage."});
        }
        const lat=weatherData.coordinates.lat;
        const lng=weatherData.coordinates.lng;
        const farmingAnalysis=await generateWeatherAdvice(weatherData,location,crop,stage,language); 
        
        const alertLevel =  farmingAnalysis.riskPercentage>=85 ? "Critical" : farmingAnalysis.riskPercentage >= 70 ? "Warning" : "Safe";

        if(alertLevel==="Critical"){
            //replace print to sms api,whatsapp api or email 
            // 1. Build a compact, single-line string template
            const baseMessage = `CRITICAL ALERT - Crop: ${crop} | City: ${city} | Stage: ${stage} | Risk: ${farmingAnalysis.riskPercentage}% (${farmingAnalysis.diseaseCategory}). Advice: ${farmingAnalysis.cropSafetyAdvice}`;

            // 2. Ensure it strictly fits within the 160-character limit for Twilio Trial Accounts
            const alertMessage = baseMessage.length > 160 
                ? baseMessage.substring(0, 157) + "..." 
                : baseMessage;
            
            //email
            await sendAlertEmail(process.env.FARMER_ALERT_EMAIL,"Critical Crop Risk Alert - ",alertMessage);
            //sms
            await sendSMSAlert(process.env.FARMER_ALERT_PHONE,alertMessage);
        }

        const savedReport = await WeatherRiskReport.create({
            userId:req.user,
            location,
            crop,
            stage,
            language,
            weatherData,
            farmingAnalysis,
            coordinates:{lat,lng},
            alertLevel
        });


        res.status(200).json({
            message:"Weather risk report generated and saved",
            savedReport
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}

export const getMyWeatherReports = async (req,res) => {
    try {
        const reports =
            await WeatherRiskReport.find({
                userId:req.user,
            }).sort({
                createdAt: -1
            });

        res.status(200).json({
            count: reports.length,
            reports
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};