import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
            // select: false,
        },
        profilePic: {
            url: { type: String, default: "url_link" },
            public_id: { type: String, default: "default public id" },
        },
        accessToken: {
            type: String,
            select: false,
        },
        forgotPasswordToken: {
            type: String,
            select: false,
        },
        forgotPasswordExpiry: {
            type: Date,
            select: false,
        },
        loggedAt: { type: [Date], select: false },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: String,
        emailVerificationTokenExpiry: Date,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.SECRET,
        { expiresIn: "1h" }
    );
};

userSchema.methods.getForgotPasswordToken = async function () {
    const token = await crypto.randomBytes(20).toString("hex");
    this.forgotPasswordToken = await crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.forgotPasswordExpiry = new Date(Date.now() + 20 * 60 * 1000);
    return token;
};

userSchema.methods.getEmailVerificationToken = async function () {
    const token = await crypto.randomBytes(20).toString("hex");
    this.emailVerificationToken = await crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.emailVerificationTokenExpiry = new Date(Date.now() + 20 * 60 * 1000);
    return token;
};

const User = mongoose.model("User", userSchema);

export default User;
