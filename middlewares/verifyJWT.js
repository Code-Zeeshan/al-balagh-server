require("dotenv").config();
const jwt = require('jsonwebtoken');
const ApiError = require("../utils/ApiError");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next(ApiError.unauthorized());
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return next(ApiError.forbidden()); //invalid token
            req.user = decoded.userInfo;
            next();
        }
    );
}

module.exports = verifyJWT