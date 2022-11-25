
const Cart = require("../models/cart.model.js");
const ApiError = require("../utils/ApiError");

exports.addOne = async (req, res, next) => {
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
}


exports.updateOne = async (req, res, next) => {
    const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
    );
    res.status(200).json(updatedCart);
}


exports.deleteOne = async (req, res, next) => {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
}


exports.findByUserId = async (req, res, next) => {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
}


exports.findMany = async (req, res, next) => {
    const carts = await Cart.find();
    res.status(200).json(carts);
}

