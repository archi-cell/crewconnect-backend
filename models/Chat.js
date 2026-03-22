import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    message: String,
    roomId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Chat", chatSchema);
