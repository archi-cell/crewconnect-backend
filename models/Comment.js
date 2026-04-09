import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    userName: {
        type: String
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
