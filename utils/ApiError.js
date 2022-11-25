// const logger = require("../utils/winstonService");
class ApiError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
    static internalServer(err) {
        if (err) {
            // logger(0, "Error Logger : " + err.toString());
            console.log("Error Console : ", err);
        }
        return new ApiError(500, "Something went wrong");
    }
    static badRequest(message = null) {
        const msg = message || "Bad request";
        return new ApiError(400, msg);
    }
    static unauthorized() {
        return new ApiError(401, "Invalid authentication credentials");
    }
    static forbidden() {
        return new ApiError(403, "You don't have permission to perform this action");
    }
    static notFound(message = null) {
        const msg = message || "The requested url/resource was not found";
        return new ApiError(404, msg);
    }
    static conflict() {
        return new ApiError(409, "Conflict Occured");
    }
}
module.exports = ApiError;