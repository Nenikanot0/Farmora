import express from "express";

import dotenv from 'dotenv';

import cors from 'cors';
import helmet from 'helmet';

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js"

dotenv.config();


const app=express(); //starts a express server

connectDB();

// 1. Enable CORS so your frontend can talk to the backend
app.use(cors()); //can receive request from different origin || acts as a guard.

// 2. Configure Helmet (The security guard)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows images to be seen
    contentSecurityPolicy: false, // Disabling CSP for local development testing
  })
);


app.use(express.json());  //tells express to read json


// Static folder for uploaded images and creates a public link for private files
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);


app.get("/",(req,res) => { 
    res.send("KrishiMitra API Running")
})


const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`Server running on port ${process.env.PORT}`);
})
