const asyncHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                status: error.statusCode || 500,
                message: error.message || "Internal Server Error",
                success: false,
                error,
            });
        }
    };
};

export { asyncHandler };
