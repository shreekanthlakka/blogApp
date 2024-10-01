import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
    {
        name: String,
        postId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
    },
    { timestamps: true }
);
const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
