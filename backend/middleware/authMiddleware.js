import jwt from 'jsonwebtoken';

export const protect = async (req,res,next) => {
    let token = req.headers.authorization?.split(" ")[1];
    
    if(!token){
        res.status(401).json({
            message:"No token,authorization denied"
        });
    }

    try{
        const decoded = await jwt.verify(token,process.env.JWT_SECRET);

        req.user=decoded.id; //so further middlewares or function dont need to check which user is it by verifying the token each time

        next();

    }catch(error){
        res.status(401).json({
            message:"Invalid token"
        })
    }
};

