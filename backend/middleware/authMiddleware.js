import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req,res,next) => {
    let token = req.headers.authorization?.split(" ")[1];
    
    if(!token){
        return res.status(401).json({
            message:"No token,authorization denied"
        });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById( decoded.id );

        if (!user) {
            return res.status(401).json({ message: "User no longer exists." });
        }
        req.user=decoded.id; //so further middlewares or function dont need to check which user is it by verifying the token each time

        req.userRole=user.role || "farmer";
        next();

    }catch(error){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
};
