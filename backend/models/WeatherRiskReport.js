import mongoose from 'mongoose';

const weatherRiskReportSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, //foreign key
        ref:"User",
        required:true
    },
    location:{
        type:String,
        required:true
    },
    crop:{
        type:String,
        required:true
    },
    stage:{
        type:String,
        required:true,
    },
    weatherData:{
        location:String,
        temperature:String,
        humidity:String,
        weather:String,
        windSpeed:Number
    },
    farmingAnalysis:{
        riskScore:String,
        riskPercentage:Number,
        risks:[String],
        irrigationAdvice:String,
        pesticideAdvice: String,
        cropSafetyAdvice: String
    },
},{timestamps:true});

const WeatherRiskReport=mongoose.model("WeatherRiskReport",weatherRiskReportSchema);

export default WeatherRiskReport;