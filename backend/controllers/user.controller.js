import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import { CustomResponse } from "../utils/customResponse.js";
import { sendCookies } from "../utils/sendCookies.js";
import {
    uploadFromBuffer,
    uploadToCloudinary,
} from "../utils/uploadToCloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "bad request", errors.array()));
    }

    // if (req.files) {
    //     const result = await uploadToCloudinary(req.files?.profilePic[0].path);
    //     if (!result) {
    //         throw new CustomError(400, "failed to upload profilePic");
    //     }
    // }

    const result = await uploadFromBuffer(req.files.profilePic[0]);

    const { username, email, password } = req.body;
    const user = await User.create({
        username,
        email,
        password,
        profilePic: {
            url: result?.secure_url || "url",
            public_id: result?.public_id || "public_id",
        },
    });
    if (!user) {
        throw new CustomError(400, "failed to create User");
    }
    res.status(201).json(
        new CustomResponse(201, "User created Sucessfully", user)
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "bad request", errors.array()));
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError(400, "Invalid credentials");
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
        throw new CustomError(400, "Invalid credentials");
    }
    if (isMatch) {
        sendCookies(user._id, res);
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new CustomError(400, "bad request");
    }
    user.accessToken = null;
    await user.save();
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 0,
    };
    res.status(200)
        .clearCookie("accessToken", options)
        .json(new CustomResponse(200, "User logged out successfully", {}));
});

const loggedInUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new CustomError(400, "bad request");
    }
    res.status(200).json({
        isAuthenticated: true,
        success: true,
        data: user,
        message: "loggedIn user details",
    });
});

export { registerUser, loginUser, logoutUser, loggedInUserDetails };
