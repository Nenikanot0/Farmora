import mongoose from 'mongoose';

const cropReportSchema=new mongoose.Schema({
    userId:{                                 //foreign key
        type:mongoose.Schema.Types.ObjectId, //specify that not a normal string 
        ref: "User",                         //but a document in User collection
        required:true
    },
    cropType:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    diseasePrediction:{
        type:String,
    },
    suggestion:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
const cropReport = mongoose.model("CropReport",cropReportSchema);
export default cropReport;