export const uploadCropImage = async(req,res) =>{
    try{
        if(!req.file){
            return res.status(400).json({
                message:"No image uploaded"
            });
        }

        res.status(200).json({
            message:"Image uploaded successfully",
            imagePath:`/uploads/${req.file.filename}`
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};