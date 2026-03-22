import User from "../models/User.js";
import jwt from "jsonwebtoken";

// REGISTER (Staff only)
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    res.json(user);
};

// LOGIN


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ✅ Check if admin
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                {
                    id: "admin",
                    email: email,
                    role: "admin"
                },
                process.env.JWT_SECRET
            );

            return res.json({
                token,
                role: "admin",
                user: { _id: "admin", email }
            });
        }

        // ✅ Normal user login
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: "user"
            },
            process.env.JWT_SECRET
        );

        res.json({
            token,
            role: "user",
            user
        });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
