const Product = require("../models/product.model.js");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");
const streamifier = require('streamifier');
const uploadToCloudinary = require("../utils/uploadToCloundinary");


exports.addOne = async (req, res, next) => {
  const jsonData = req.body;
  if (req.files?.img) {
    const result = await uploadToCloudinary(req.files.img.data, "images");
    jsonData.imageURL = result.secure_url;
    jsonData.cloudinaryId = result.public_id;
  }
  const newProduct = new Product(jsonData);
  const savedProduct = await newProduct.save();
  res.status(200).json(savedProduct);
}

exports.updateOne = async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.query.params,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(200).json(updatedProduct);
}

exports.deleteOne = async (req, res, next) => {
  await Product.findByIdAndDelete(req.query.params);
  res.status(200).json("Product has been deleted...");
}

exports.findOne = async (req, res, next) => {
  const product = await Product.findById(req.query.params);
  res.status(200).json(product);
}

exports.findMany = async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  let products;

  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 }).limit(1);
  } else if (qCategory) {
    products = await Product.find({
      categories: {
        $in: [qCategory],
      },
    });
  } else {
    products = await Product.find();
  }

  res.status(200).json(products);
}


