import { generateWeatherAdvice } from "../utils/aiWeatherService.js"; //from gemini
import {getWeatherByCity} from "../utils/weatherService.js"; //get weather of city
export const getWeather=async(req,res) => {
    try{
        const {village,city,district,crop,stage}=req.body;

        const validStages = [
            "seedling",
            "vegetative",
            "flowering",
            "harvest"
            ];

        if(!village && !district && !city){
            return res.status(400).json({message:"Please provide a village, city, or district name."});
        }
        
        let weatherData=null;
        let resolvedAt="";

        try{
            if(village){
                weatherData=await getWeatherByCity(village);
                resolvedAt="village";
            }
        }catch(err){}

        if(!weatherData && city){
            try{
                weatherData=await getWeatherByCity(city);
                resolvedAt="city";
            }catch(err){}
        }
        if(!weatherData && district){
            try{
                weatherData=await getWeatherByCity(district);
                resolvedAt="district";
            }catch(err){}
        }

        if (!weatherData) {
            throw new Error("Location not recognized by weather service.");
        }

        if(!validStages.includes(stage.toLowerCase())){
            return res.status(400).json({message:"Please provide a correct crop stage."});
        }

        const farmingAdvice=await generateWeatherAdvice(weatherData,crop,stage); 
        
        res.status(200).json({
            message: "Crop-specific weather analysis completed",
            crop,
            stage,
            resolvedAt,
            weatherData,
            farmingAdvice
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}