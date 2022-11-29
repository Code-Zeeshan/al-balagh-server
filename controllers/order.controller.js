const Order = require("../models/order.model.js");
const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError");

exports.addOne = async (req, res, next) => {
    const {
        count,
        products,
        userId,
        amount
    } = req.body;
    const { address } = await User.findById(userId, { address: 1 });
    const newOrder = new Order({
        count,
        products,
        userId,
        address,
        amount
    });
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
}

//UPDATE
exports.updateOne = async (req, res, next) => {
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
    );
    res.status(200).json(updatedOrder);
}

//DELETE
exports.deleteOne = async (req, res, next) => {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
}

//GET USER ORDERS
exports.findByUser = async (req, res, next) => {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
}

// //GET ALL

exports.findMany = async (req, res, next) => {
    const orders = await Order.find();
    res.status(200).json(orders);
}

// GET MONTHLY INCOME

exports.getIncome = async (req, res, next) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
            $project: {
                month: { $month: "$createdAt" },
                sales: "$amount",
            },
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: "$sales" },
            },
        },
    ]);
    res.status(200).json(income);
}