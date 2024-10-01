import express from "express";
import { body, checkSchema } from "express-validator";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { profileValidationSchema } from "../validations/profile.validationSchema.js";
import {
    createProfile,
    getProfile,
    updateProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

router
    .route("/")
    .post(isLoggedIn, checkSchema(profileValidationSchema), createProfile)
    .get(isLoggedIn, getProfile)
    .put(
        isLoggedIn,
        body("name").notEmpty().trim(),
        body("phonenumber").notEmpty().trim().isMobilePhone("any"),
        body("address").notEmpty().trim(),
        updateProfile
    );

export default router;
