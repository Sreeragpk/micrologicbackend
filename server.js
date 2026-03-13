import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.js";
import contactRoutes from "./routes/contact.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://micrologictesting.netlify.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
  })
);

app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});