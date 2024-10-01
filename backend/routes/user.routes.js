import express from "express";
import { body, checkSchema } from "express-validator";
import {
    loggedInUserDetails,
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/user.controller.js";
import { userValidationSchema } from "../validations/user.validationSchema.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { uploadMemoryStorage } from "../middlewares/multer.js";
const router = express.Router();

router
    .route("/register")
    .post(
        uploadMemoryStorage.fields([{ name: "profilePic", maxCount: 1 }]),
        checkSchema(userValidationSchema),
        registerUser
    );

router
    .route("/login")
    .post(
        body("email")
            .exists()
            .notEmpty()
            .isEmail()
            .trim()
            .withMessage("Provide valid email")
            .normalizeEmail(),
        body("password").exists().notEmpty().trim(),
        loginUser
    );
router.route("/logout").post(isLoggedIn, logoutUser);
router.route("/loggedinuser").get(isLoggedIn, loggedInUserDetails);

export default router;
