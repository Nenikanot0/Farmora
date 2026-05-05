import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- ROUTES ---


app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);

app.get("/", (req, res) => { 
    res.send("KrishiMitra API Running");
});

// 2. Catch-all 404 (MUST BE LAST)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found on server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});