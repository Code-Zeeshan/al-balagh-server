const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const CONFIG = require("../config");

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(ApiError.badRequest('Username and password are required.'));
    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) return next(ApiError.unauthorized());
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {
                userInfo: {
                    email: foundUser.email,
                    role: foundUser.role
                }
            },
            CONFIG.TOKEN.ACCESS,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            CONFIG.TOKEN.REFRESH,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Send authorization roles and access token to user
        res.status(200).send({
            role: foundUser.role,
            accessToken
        },
        );
    }
}


exports.logout = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

exports.register = async (req, res, next) => {
    const {
        name,
        email,
        password,
        address,
        city,
        contact
    } = req.body;
    console.log(req.body);
    if (!email || !password) return next(ApiError.badRequest('Username and password are required.'));
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email });
    if (duplicate) return next(ApiError.conflict());
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //store the new user
    const newUser = await User.create({
        name,
        email,
        address,
        city,
        contact,
        "password": hashedPassword
    });
    res.status(201).json({ 'success': `New user ${newUser} created!` });
}

exports.handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return next(ApiError.unauthorized());
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return next(ApiError.forbidden()); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        CONFIG.TOKEN.REFRESH,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return next(ApiError.forbidden());
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        email: foundUser.email,
                        role: foundUser.role
                    }
                },
                CONFIG.TOKEN.ACCESS,
                { expiresIn: '1h' }
            );
            res.status(200).send({
                role: foundUser.role,
                accessToken
            });
        }
    );
}