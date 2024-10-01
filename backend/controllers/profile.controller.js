import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import { CustomResponse } from "../utils/customResponse.js";
import Profile from "../models/profile.model.js";

const createProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "validation errors", errors.array()));
    }
    const { name, email, phonenumber, address } = req.body;
    const pro = await Profile.create({
        name,
        email: req.user.email,
        phonenumber,
        address,
        userId: req.user._id,
    });
    if (!pro) {
        throw new CustomError(401, "failed to create profile");
    }
    const profile = await Profile.findById(pro._id).populate("userId", [
        "username",
        "email",
    ]);
    res.status(201).json(
        new CustomResponse(201, "profile created sucessfully", profile)
    );
});

const getProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ userId: req.user._id }).populate(
        "userId",
        ["username", "email"]
    );
    if (!profile) {
        throw new CustomError(404, "profile not found");
    }
    res.status(200).json(new CustomResponse(200, "profile fetched", profile));
});

const updateProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(new CustomError(400, "validation errors", errors.array()));
    }

    const { name, email, phonenumber, address } = req.body;
    const profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        {
            name,
            email: req.user.email,
            phonenumber,
            address,
        },
        { new: true }
    );
    if (!profile) {
        throw new CustomError(404, "profile update failed ");
    }
    res.status(200).json(new CustomResponse(200, "profile updated", profile));
});

export { createProfile, getProfile, updateProfile };
