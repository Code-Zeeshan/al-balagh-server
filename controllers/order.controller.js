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
    // const orders = await Order.find();
    const orders = await Order.aggregate([
        // { $match: { createdAt: { $gte: previousMonth } } },
        {
            $unwind: "$products"
        },
        {
            $lookup: {
                from: "products",
                let: { product_id: "$products.productId", quantity: "$products.quantity" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$product_id", "$_id"]
                            }
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            imageURL: 1,
                            price: 1,
                            quantity: "$$quantity"
                        }
                    }
                ],
                as: "products"
            }
        },
        {
            $addFields: {
                products: {
                    $arrayElemAt: ["$products", 0]
                }
            }
        },
        {
            $lookup: {
                from: "users",
                let: { userId: "$userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$userId", "$_id"]
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            city: 1
                        }
                    }
                ],
                as: "userId"
            }
        },
        {
            $addFields: {
                userId: {
                    $arrayElemAt: ["$userId", 0]
                }
            }
        },
        {
            $project: {
                // month: { $month: "$createdAt" },
                userId: "$userId._id",
                name: "$userId.name",
                address: "$userId.address",
                email: "$userId.email",
                city: "$userId.city",
                products: {
                    imageURL: "$products.imageURL",
                    quantity: "$products.quantity",
                    title: "$products.title",
                    price: "$products.price"
                },
                amount: 1,
                status: 1
            }
        },
        {
            $group: {
                _id: {
                    userId: "$userId",
                    name: "$name",
                    address: "$address",
                    email: "$email",
                    city: "$city"
                },
                orders: {
                    $addToSet: {
                        products: "$products",
                        // userId: "$userId._id",
                    }
                },
                total: { $sum: "$amount" }
            },
        },
    ]);
    console.log(JSON.stringify(orders, 0, 4));
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