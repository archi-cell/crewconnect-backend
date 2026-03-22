import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

// ✅ Get chat history
router.get("/:roomId", async (req, res) => {
    const chats = await Chat.find({ roomId: req.params.roomId });
    res.json(chats);
});

export default router;
