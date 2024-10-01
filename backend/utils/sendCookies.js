import User from "../models/user.model.js";
import { CustomError } from "./customError.js";

const sendCookies = async (_id, res) => {
    let user;
    try {
        user = await User.findById(_id).select("+accessToken +loggedAt");
        if (!user) {
            throw {
                status: 404,
                message: "User not found",
            };
        }
        const accessToken = await user.generateAccessToken();
        user.accessToken = accessToken;
        user.loggedAt = [...user.loggedAt, new Date().toISOString()];
        await user.save({ validateBeforeSave: false });
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 1000 * 60 * 60 * 1,
        };
        res.status(200).cookie("accessToken", accessToken, options).json({
            statusCode: 200,
            success: true,
            message: "Login successful",
            session: accessToken,
            data: user,
        });
    } catch (error) {
        res.status(error.status || 400).json(
            new CustomError(
                error.status || 400,
                error.message || "something went wrong",
                error
            )
        );
    }
};

export { sendCookies };
