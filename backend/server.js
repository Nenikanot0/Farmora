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

//cors
const allowedOrigins = [
  'https://farmora-zeta.vercel.app',
  'http://localhost:5173' // for local development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
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