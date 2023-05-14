
const Cart = require("../models/cart.model.js");
const Chat = require("../models/chat.model.js");
const ChatService = require("../service/chat.service.js");
const ApiError = require("../utils/ApiError");

exports.findOne = async (req, res, next) => {
    const { filter, project } = req.body;
    const chat = await Chat.findOne(filter, project);
    res.status(200).json(chat.conversations);
}

exports.handleChat = async (req, res, next) => {
    const { filter, project } = req.body;
    await ChatService.chatSocket(filter);
    res.status(200).json();
}
