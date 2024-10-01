import Profile from "../models/profile.model.js";

const profileValidationSchema = {
    userId: {
        in: ["req"],
        custom: {
            options: async (value, { req }) => {
                const profile = await Profile.find({ userId: req.user._id });
                if (profile) {
                    throw new Error("Profile already exists");
                }
                return true;
            },
        },
    },
    name: {
        in: ["body"],
        exists: {
            errorMessage: "Name is required",
        },
        notEmpty: {
            errorMessage: "Name cannot be empty",
        },
        trim: true,
    },
    phonenumber: {
        in: ["body"],
        exists: {
            errorMessage: "phonenumber is required",
        },
        notEmpty: {
            errorMessage: "phonenumber cannot be empty",
        },
        trim: true,
        isMobilePhone: {
            options: "any",
            errorMessage: "invalid phonenumber",
        },
    },
    address: {
        in: ["body"],
        exists: {
            errorMessage: "address is required",
        },
        notEmpty: {
            errorMessage: "address cannot be empty",
        },
        trim: true,
    },
};

export { profileValidationSchema };
