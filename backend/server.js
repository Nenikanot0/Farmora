import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();


const app=express(); //starts a express server

connectDB();

// 1. Enable CORS so your frontend can talk to the backend
app.use(cors()); //can receive request from different origin || acts as a guard.

// 2. Configure Helmet (The security guard)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"], // Allow the server to talk to itself
        "connect-src": ["'self'", "http://localhost:5000", "ws://localhost:*"], // Allow connections to your API and WebSockets
      },
    },
  })
);


app.use(express.json());  //tells express to read json

app.use("/api/auth", authRoutes);

app.get("/",(req,res) => { 
    res.send("KrishiMitra API Running")
})


const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`Server running on port ${process.env.PORT}`);
})
