module.exports = (req, res, next) => {

    res.success = (data = null, message = "Success", statusCode = 200) => {
        res.status(statusCode).json({
            success: true,
            message,
            data
        });
    };

    res.error = (message = "Error", statusCode = 500) => {
        res.status(statusCode).json({
            success: false,
            message
        });
    };

    next();
};
