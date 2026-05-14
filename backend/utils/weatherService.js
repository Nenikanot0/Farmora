import axios from "axios";

export const getWeatherByCity=async(locationName) =>{
    try{
        // Step 1: Geocoding converts for converting local village/district or city -> coordinates 
        const geoUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${process.env.WEATHER_API_KEY}`;

        const geoResponse = await axios.get(geoUrl);

        if(!geoResponse.data.length){
            throw new Error("Location not found");
        }
        
        const {lat,lng,name,country}=geoResponse.data[0];

        // Step 2: Get weather from coordinates
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        
        const weatherResponse=await axios.get(weatherUrl);

        const weatherData=weatherResponse.data;

        return {
            location:`${name},${country}`,
            temperature:weatherData.main.temp,
            humidity:weatherData.main.humidity,
            weather:weatherData.weather[0].description,
            windSpeed:weatherData.wind.speed,
            coordinates:{lat,lng}
        };

    }catch(error){
         throw new Error("Weather fetch failed: " + error.message);
    }
}