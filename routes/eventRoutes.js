import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


// ✅ CREATE EVENT (Admin + Notification)
router.post("/create", verifyToken, isAdmin, async (req, res) => {
    try {
        const event = await Event.create(req.body);

        // 🔔 Emit notification
        const io = req.app.get("io");
        io.emit("new_event", {
            message: `New event created: ${event.title}`
        });

        res.json(event);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error creating event" });
    }
});


// ✏️ UPDATE EVENT (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json({ msg: "Error updating event" });
    }
});


// 🗑️ DELETE EVENT (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ msg: "Event deleted" });

    } catch (err) {
        res.status(500).json({ msg: "Error deleting event" });
    }
});


// 📊 ADMIN STATS (keep before generic routes)
router.get("/stats/all", verifyToken, isAdmin, async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalUsers = await User.countDocuments();

        const events = await Event.find();

        const assignedCount = events.reduce(
            (acc, e) => acc + (e.staffAssignments?.length || 0),
            0
        );

        res.json({
            totalEvents,
            totalUsers,
            assignedCount
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error fetching stats" });
    }
});


// ✅ GET ALL EVENTS (for everyone logged in)
router.get("/", verifyToken, async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);

    } catch (err) {
        res.status(500).json({ msg: "Error fetching events" });
    }
});

export default router;
