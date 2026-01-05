import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(cors({
  origin: [
    "https://micrologictesting.netlify.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on", PORT));
