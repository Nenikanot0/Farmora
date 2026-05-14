import { generateWeatherAdvice } from "../utils/aiWeatherService.js"; //from gemini
import {getWeatherByCity} from "../utils/weatherService.js"; //get weather of city
import WeatherRiskReport from "../models/WeatherRiskReport.js";

export const getWeather=async(req,res) => {
    try{
        const {village,city,district,crop,stage,language="English"}=req.body;

        const validStages = ["seedling","vegetative","flowering","harvest"];


        if(!village && !district && !city){
            return res.status(400).json({message:"Please provide a village, city, or district name."});
        }
        
        let weatherData=null;
        let resolvedAt="";

        let location="";
        try{
            if(village){
                weatherData=await getWeatherByCity(village);
                location=village;
                resolvedAt="village";
            }
        }catch(err){}

        if(!weatherData && city){
            try{
                weatherData=await getWeatherByCity(city);
                location=city;
                resolvedAt="city";
            }catch(err){}
        }
        
        if(!weatherData && district){
            try{
                weatherData=await getWeatherByCity(district);
                location=district;
                resolvedAt="district";
            }catch(err){}
        }

        if (!weatherData) {
            throw new Error("Location not recognized by weather service.");
        }

        if(!validStages.includes(stage.toLowerCase())){
            return res.status(400).json({message:"Please provide a correct crop stage."});
        }
        const lat=weatherData.coordinates.lat;
        const lng=weatherData.coordinates.lng;
        const farmingAnalysis=await generateWeatherAdvice(weatherData,crop,stage,language); 
        
        const alertLevel =  farmingAnalysis.riskPercentage>=85 ? "Critical" : farmingAnalysis.riskPercentage >= 70 ? "Warning" : "Safe";

        if(alertLevel==="Critical"){
            //replace print to sms api,whatsapp api or email 
            console.log(`Alert: ${crop} in ${location} at ${stage} stage has CRITICAL risk`);
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