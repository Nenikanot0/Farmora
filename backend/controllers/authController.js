import User from "../models/User.js";
import bcrypt from "bcryptjs"; //encryption
import jwt from "jsonwebtoken"; //token creation

export const registerUser=async(req,res) => {
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message:"Fill all details"
            });
        }

        const userExists=await User.findOne({email});

        if(userExists){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const user= await User.create({
            name,
            email,
            password:hashedPassword
        });

        const token=jwt.sign( { id : user._id } , process.env.JWT_SECRET , { expiresIn : "7d" } ); //payload(user data),secret,optional

        return res.status(200).json({
            message:"User registered Successfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });

    } catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
};

export const loginUser= async(req,res) => {
    try{

        const {email,password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                message:"Fill all details"
            });
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }

        const token = await jwt.sign( { id:user._id },process.env.JWT_SECRET,{expiresIn:"7d"});

        return res.status(200).json({
            message:"Login Successfull",
            token,
            user : {
                id : user._id,
                name: user.name,
                email : user.email
            }
        });


    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
};


