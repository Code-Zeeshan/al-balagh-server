const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const CONFIG = require("../config");

exports.updateOne = async (req, res, next) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
    );
    res.status(200).json(updatedUser);
}

exports.deleteOne = async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
}

exports.findOne = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    // const { password, ...others } = user._doc;
    res.status(200).json(user);
}

exports.findMany = async (req, res, next) => {
    const query = req.query.new;
    const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
    res.status(200).json(users);
}

exports.stats = async (req, res, next) => {
    const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
            $project: {
                month: { $month: "$createdAt" },
            },
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json(data)
}



