import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // your frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use("/api/chat", chatRoutes);

app.listen(5000, () => console.log("Backend running on 5000"));
