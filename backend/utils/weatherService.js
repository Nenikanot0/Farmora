import axios from "axios";

export const getWeatherByCity=async(city) =>{
    try{
        // Step 1: Get coordinates from city name
        const geoUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.WEATHER_API_KEY}`;

        const geoResponse = await axios.get(geoUrl);

        if(!geoResponse.data.length){
            throw new Error("Location not found");
        }
        
        const {lat,lon,name,country}=geoResponse.data[0];

        // Step 2: Get weather from coordinates
        const weatherUrl= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

        const weatherResponse=await axios.get(weatherUrl);

        const weatherData=weatherResponse.data;

        return {
            location:`${name},${country}`,
            temperature:weatherData.main.temp,
            humidity:weatherData.main.humidity,
            weather:weatherData.weather[0].description,
            windSpeed:weatherData.wind.speed
        };

    }catch(error){
         throw new Error("Weather fetch failed: " + error.message);
    }
}