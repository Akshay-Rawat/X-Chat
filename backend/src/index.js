import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app,server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware to set CSP header (Allow fonts from fonts.gstatic.com)
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; font-src 'self' https://fonts.gstatic.com;"
    );
    next();
});

// Middleware
app.use(express.json({ limit: "10mb" })); // Increase JSON payload size limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded payload size limit
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

// Server Start
server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
}); 
