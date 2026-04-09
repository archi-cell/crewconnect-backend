import express from "express";
import Comment from "../models/Comment.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add comment
router.post("/", authMiddleware, async (req, res) => {
    const { eventId, text } = req.body;

    const comment = new Comment({
        eventId,
        text,
        userName: req.user.name
    });

    await comment.save();

    // 🔔 Emit notification
    const io = req.app.get("io");
    io.emit("new_comment", {
        message: `${req.user.name} commented on an event`,
        eventId
    });

    res.json(comment);
});

// ✅ Get comments by event
router.get("/:eventId", async (req, res) => {
    try {
        const comments = await Comment.find({
            eventId: req.params.eventId
        }).sort({ createdAt: -1 });

        res.json(comments);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
