import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ CREATE EVENT (Admin only)
router.post("/create", verifyToken, isAdmin, async (req, res) => {
    const event = await Event.create(req.body);
    res.json(event);
});

// ✅ UPDATE EVENT
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// ✅ GET ALL EVENTS
// ✅ ALWAYS KEEP THIS FIRST
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

// THEN generic routes
router.get("/", verifyToken, async (req, res) => {
    const events = await Event.find();
    res.json(events);
});
export default router;
