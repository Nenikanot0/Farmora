import WeatherRiskReport from "../models/WeatherRiskReport.js";
import User from "../models/User.js";
import { create } from "axios";


export const getDashboardStats = async(req,res)=>{
    try{
        const totalFarmers=await User.countDocuments({role:"farmer"});

        const totalReports=await WeatherRiskReport.countDocuments();


        //Average risk
        const avgRisk= await WeatherRiskReport.aggregate([
            {
                $group:{
                    _id:null,
                    averageRisk:{
                        $avg: "$farmingAnalysis.riskPercentage"
                    }
                }
            }
        ]);

        const highRiskAlert = await WeatherRiskReport.countDocuments({
            "farmingAnalysis.riskScore":"High"
        });

        res.status(200).json({
            totalFarmers,
            totalReports,
            avgRisk ,
            highRiskAlert
        })
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

export const getTopRiskyCrops= async(req,res) =>{
    try{
        const riskyCrops= await WeatherRiskReport.aggregate([
            {
                $group:{ 
                    _id:"$crop" ,
                    averageRisk:{ 
                        $avg: "$farmingAnalysis.riskPercentage" 
                    },
                    totalReports:{
                        $sum:1
                    }
                }
            }, //aggregation done
            {
                $sort:{
                    averageRisk:-1
                }
            },
            {
                $limit:5
            }
        ]);

        return res.status(200).json(riskyCrops);

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getCityRiskTrends=async (req,res) =>{
    try{
        const cityRisk = await WeatherRiskReport.aggregate([
            {
                $group:{
                    _id:"$city",
                    averageRisk:{
                        $avg:"$farmingAnalysis.riskPercentage"
                    },
                    totalReports:{
                        $sum:1
                    }
                },
            },
            {
               $sort:{
                averageRisk:-1
               } 
            }
    ]);
        res.status(200).json(cityRisk);
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getMonthlyRiskTrends = async(req,res) => {
    try{
        const monthlyTrends = await WeatherRiskReport.aggregate([
            {
                $group:{
                    _id: { //compound id
                        month:{
                            $month:"$createdAt"
                        },
                        year:{
                            $year:"$createdAt"
                        }
                    },
                    avgRisk:{
                        $avg:"$farmingAnalysis.riskPercentage"
                    },
                    totalReports:{
                        $sum : 1
                    },
                    highRiskReports:{
                        $sum:{
                            $cond:[
                                {
                                    $eq:[
                                        "$farmingAnalysis.riskScore","High"
                                    ]
                                },1,0
                            ]
                        }
                    }
                }
            },
            {
                $sort:{
                    "_id.year":1, //order matters
                    "_id.month":1
                }
            }
        ]);

        res.status(200).json(monthlyTrends);

    }catch(error){
        res.status(500).json({message:error.message});
    }
} 

export const getHighRiskAlerts = async(req,res) =>{
    try{
        const alerts = await WeatherRiskReport.find({
            "farmingAnalysis.riskScore":"High"
        }).sort({
            createdAt:-1
        }).limit(10);

        res.status(200).json(alerts);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

export const getDiseaseCategoryAnalytics = async(req,res) => {
    try{
        const diseaseStats = await WeatherRiskReport.aggregate([
            {
                $group:{
                    _id:"$farmingAnalysis.diseaseCategory",
                    totalCases:{
                        $sum:1
                    },
                    averageRisk:{
                        $avg:"$farmingAnalysis.riskPercentage"
                    }
                }
            },
            {
                $sort:{
                    totalCases:-1
                }
            }
        ]);

        res.status(200).json(diseaseStats);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}

export const getDiseaseHotspots = async(req,res) => {
    try{
        const hotspots=await WeatherRiskReport.aggregate([
            {
                $match:{
                    "farmingAnalysis.riskScore":"High"
                }
            },
            {
                $group:{
                    _id:{
                        location:"$location",
                        disease:"$farmingAnalysis.diseaseCategory"
                    },
                    cases:{
                        $sum:1
                    },
                    averageRisk:{
                        $avg:"$farmingAnalysis.riskPercentage"
                    },
                    coordinates:{
                        $first:"$coordinates"
                    }
                }
            },
            {
                $sort:{
                    cases:-1
                }
            }
        ]);

        res.status(200).json(hotspots);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}

export const getCriticalAlerts = async(req,res) => {
    try{
        const alerts = await WeatherRiskReport.find({ alertLevel:"Critical" }).sort({createdAt:-1}).limit(20);

        return res.status(200).json(alerts);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}