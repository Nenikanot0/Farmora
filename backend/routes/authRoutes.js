import express from 'express';
import {registerUser,loginUser} from "../controllers/authController.js";

const router=express.Router();  //creates a routes for all authentication related routers


router.post("/register",registerUser);
router.post("/login",loginUser);

export default router;
