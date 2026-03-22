import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    clientName: String,
    createdBy: String,

    date: String,
    eventType: String,
    venue: String,

    timeline: [
        {
            task: String,
            time: String
        }
    ],

    staffAssignments: [
        {
            role: String,
            name: String,
            time: String
        }
    ]
});

export default mongoose.model("Event", eventSchema);
