import express from "express";
import "dotenv/config" ;

import cors from 'cors';
import helmet from 'helmet';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // fallback for your local testing
  credentials: true, // required if you are handling JWT cookies or sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, //so that browser allows frontend to access the backend assets 
    contentSecurityPolicy: false, // as csp block dev tools /external resouces or scripts
    referrerPolicy: { policy: "strict-origin-when-cross-origin" } 
  }));



app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/weather",weatherRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/market",marketRoutes);


app.get("/", (req, res) => { 
    res.send("Farmora API Running");
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found on server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});