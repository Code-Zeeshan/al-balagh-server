
const Cart = require("../models/cart.model.js");
const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError");

exports.addOne = async (req, res, next) => {
    const { productId, count } = req.body;
    const user = await User.findOne({ email: req.user.email }, { _id: 1 });
    // const update = {
    //     $addToSet: {
    //         products: [{
    //             productId,
    //             count
    //         }]
    //     },
    // };
    // console.log(JSON.stringify(update));
    // const savedCart = await Cart.updateOne({
    //     userId: user._id,
    //     products: {
    //         $elemMatch: {
    //             productId
    //         }
    //     }
    // },
    //     // $setOnInsert: {
    //     update
    //     // },
    //     // $set: {
    //     //     "products.$.count": count
    //     // }
    //     , { upsert: true, new: true });
    let cart = await Cart.findOne({ userId: user._id });
    if (cart) {
        let flag = true;
        cart.products.forEach(ele => {
            if (productId === ele.productId.toString()) {
                ele.count = count;
                flag = false;
            }
        });
        if (flag) {
            cart.products.push({ productId, count });
        }
        cart = await cart.save();
    } else {
        cart = await new Cart({
            userId: user._id,
            products: [{ productId, count }],
        }).save();
    }
    const itemCount = cart?.products.reduce((acc, value) => acc + value.count, 0);
    // const newCart = new Cart();
    // const savedCart = await newCart.save();
    res.status(200).json({ cart, itemCount });
}


exports.updateOne = async (req, res, next) => {
    const { userId, count, productId } = req.body;
    const filter = { userId, "products.productId": productId };
    let update = {
        $set: { "products.$.count": count }
    };
    if (count === 0) {
        update = {
            $pull: {
                products: {
                    productId
                }
            }
        };
    }
    const updatedCart = await Cart.updateOne(
        filter,
        update,
        { new: true }
    );
    res.status(200).json(updatedCart);
}


exports.deleteOne = async (req, res, next) => {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
}


exports.findByUserId = async (req, res, next) => {
    // const user = await User.findOne({refreshToken: req.cookies.jwt });
    const user = await User.findOne({ email: req.user.email }, { _id: 1 });
    const cart = await Cart.findOne({ userId: user._id })
        .populate("products.productId",
            { title: 1, price: 1, quantity: 1, imageURL: 1 });
    res.status(200).json(cart);
}

exports.getCount = async (req, res, next) => {
    // const user = await User.findOne({refreshToken: req.cookies.jwt });
    const user = await User.findOne({ email: req.user.email }, { _id: 1 });
    const cart = await Cart.findOne({ userId: user._id }, { products: 1 });
    let count = 0;
    if (cart?.products.length > 0) {
        count = cart.products.reduce((acc, value) => acc + value.count, 0);
    }
    res.status(200).json(count);
}


exports.findMany = async (req, res, next) => {
    const carts = await Cart.find();
    res.status(200).json(carts);
}

