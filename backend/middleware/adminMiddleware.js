const adminOnly = (req,res,next) =>{
    try{
        if(!req.userRole || req.userRole!=="admin"){
            return res.status(400).json({message:"Permission denied.Admin Only"});
        }
        next();
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

export default adminOnly;