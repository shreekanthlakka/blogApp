class CustomError extends Error {
    constructor(
        statusCode = 400,
        message = "something went wrong",
        error = []
    ) {
        super();
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.success = false;
    }
}

export { CustomError };
