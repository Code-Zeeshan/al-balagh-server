const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema(
    {
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        name: { type: String },
        conversations: {
            type: [
                {
                    sentBy: {
                        type: Schema.ObjectId,
                        ref: "User",
                    },
                    message: { type: String },
                    createdAt: { type: Date },
                    updatedAt: { type: Date },
                },
            ],
            default: []
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);