import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Chat from "./models/Chat.js";

dotenv.config();

// ✅ Create app
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);

// ✅ Create server
const server = http.createServer(app);

// ✅ Socket setup
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
    });

    socket.on("sendMessage", async (data) => {
        try {
            const { senderId, receiverId, message, roomId } = data;

            // ✅ Save to DB
            await Chat.create({ senderId, receiverId, message, roomId });

            // ✅ Emit to room
            io.to(roomId).emit("receiveMessage", data);

        } catch (err) {
            console.log("❌ Chat Error:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});


// ✅ FUNCTION: Connect DB first, THEN start server
const startServer = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // faster fail if error
        });

        console.log("✅ MongoDB Connected");

        server.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on port ${process.env.PORT}`);
        });

    } catch (err) {
        console.log("❌ DB CONNECTION FAILED:", err);
        process.exit(1);
    }
};

startServer();
