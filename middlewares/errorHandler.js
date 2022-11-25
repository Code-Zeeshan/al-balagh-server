const ApiError = require("../utils/ApiError");
module.exports = (err, req, res, next) => {
    console.log("errorHandlerMiddleware -->", err);
    if (err instanceof ApiError) {
        return res.status(err.code).send({
            message: err.message
        });
    }
    res.status(500).send({
        message: "Something Went Wrong"
    });
};
