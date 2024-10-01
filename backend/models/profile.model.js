import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: { type: String },
        email: { type: String },
        phonenumber: { type: String },
        address: { type: String },
    },
    { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
