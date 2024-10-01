import User from "../models/user.model.js";

const userValidationSchema = {
    username: {
        in: ["body"],
        exists: {
            errMessage: "username should exists",
        },
        notEmpty: {
            errMessage: "username should not be empty",
        },
        trim: true,
    },
    email: {
        in: ["body"],
        exists: {
            errMessage: "email should exists",
        },
        notEmpty: {
            errMessage: "email should not be empty",
        },
        trim: true,
        isEmail: {
            errMessage: "email is not valid ",
        },
        custom: {
            options: async (val) => {
                const user = await User.findOne({ email: val });
                if (user) {
                    throw new Error("email already exists");
                }
                return true;
            },
        },
    },
    password: {
        in: ["body"],
        exists: {
            errMessage: "password should exists",
        },
        notEmpty: {
            errMessage: "password should not be empty",
        },
        trim: true,
        isLength: {
            options: {
                min: 6,
                max: 20,
            },
            errMessage: "password should be between 6 and 20 characters",
        },
    },
    profilePic: {
        in: ["body"],
        custom: {
            options: (val, { req }) => {
                if (Object.keys(req.files).length === 0) {
                    throw new Error("profile pic is required");
                }
                return true;
            },
        },
    },
};

export { userValidationSchema };
