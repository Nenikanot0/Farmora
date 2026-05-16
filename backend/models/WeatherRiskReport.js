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
    language:{
        type:String,
    },
    weatherData:{
        location:String,
        temperature:Number,
        humidity:Number,
        weather:String,
        windSpeed:Number
    },
    farmingAnalysis:{
        riskScore:String,
        riskPercentage:Number,
        diseaseCategory:String,
        risks:[String],
        irrigationAdvice:String,
        pesticideAdvice: String,
        cropSafetyAdvice: String
    },
    coordinates:{
        lat:{
            type:Number,
            required:true
        },
        lng:{
            type:Number,
            required:true
        }
    },
    alertLevel:{
        type:String,
        enum:["Safe","Warning","Critical"],
        default:"Safe"
    }
},{timestamps:true});

const WeatherRiskReport=mongoose.model("WeatherRiskReport",weatherRiskReportSchema);

export default WeatherRiskReport;