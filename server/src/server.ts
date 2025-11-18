import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// NEW (TS/CommonJS-friendly)
import authRoutes from "./routes/auth.routes";
import journalRoutes from "./routes/journal.routes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("Drink Journal API");
});

app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
