import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get chat users dynamically
router.get("/chat-users", verifyToken, async (req, res) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;

        // 👉 If admin logged in
        if (req.user.email === adminEmail) {
            const users = await User.find({ email: { $ne: adminEmail } });
            return res.json(users);
        }

        // 👉 If normal user logged in
        const admin = await User.findOne({ email: adminEmail });
        return res.json([
            {
                _id: "admin",
                name: "Admin",
                email: adminEmail
            }
        ]);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
