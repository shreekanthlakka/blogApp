import User from "../models/user.model";
import { CustomError } from "./customError";

const sendVerificationEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError(400, "something went wrong");
    }
    const token = await user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    const myUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/users/emailverification/${token}`;
};

export { sendVerificationEmail };
