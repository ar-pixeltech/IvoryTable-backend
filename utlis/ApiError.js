class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

function handlePrismaError(err) {
    if (err.code === 'P2002' && err.meta && err.meta.target) {
        const field = err.meta.target[0];
        return new ApiError(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, 409);
    }
    // Add more Prisma error handling as needed
    return err;
}

module.exports = { ApiError, handlePrismaError };
