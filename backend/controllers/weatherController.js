import { generateWeatherAdvice } from "../utils/aiWeatherService.js"; //from gemini
import {getWeatherByCity} from "../utils/weatherService.js"; //get weather of city
export const getWeather=async(req,res) => {
    try{
        const {city}=req.body;
        if(!city){
            return res.status(400).json({ message: "Please provide city/district name" });
        }

        const weatherData=await getWeatherByCity(city);

        const farmingAdvice=await generateWeatherAdvice(weatherData); 
        
        res.status(200).json({
            message: "Smart weather analysis completed",
            weatherData,
            farmingAdvice
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}