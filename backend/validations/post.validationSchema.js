const postValidationSchema = {
    title: {
        in: ["body"],
        exists: {
            errorMessage: "Title is required",
        },
        notEmpty: {
            errorMessage: "Title should not be empty",
        },
        trim: true,
    },
    content: {
        in: ["body"],
        exists: {
            errorMessage: "content is required",
        },
        notEmpty: {
            errorMessage: "Content should not be empty",
        },
        trim: true,
    },
    authorId: {
        in: ["req"],
        custom: {
            options: (val, { req }) => {
                if (!isMongoId(req.user._id)) {
                    throw new Error("not a valid mongoId");
                }
                return true;
            },
        },
    },
    // featuredImage: {
    //     in: ["body"],
    //     custom: {
    //         options: (val, { req }) => {
    //             if (Object.keys(req.files)?.length === 0) {
    //                 throw new Error(" please provide one profile pic ");
    //             }
    //             if (`${req.files?.featuredImage.length}` > 1) {
    //                 throw new Error("Please upload single files");
    //             }
    //             return true;
    //         },
    //     },
    // },
};

export { postValidationSchema };
