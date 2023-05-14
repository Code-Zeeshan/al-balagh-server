const router = require("express").Router();
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const productRoute = require("./product.route.js");
const cartRoute = require("./cart.route");
const chatRoute = require("./chat.route");
const orderRoute = require("./order.route");
const stripeRoute = require("./stripe.route");
const verifyJWT = require("../middlewares/verifyJWT");

router.use("/auth", authRoute);
router.use("/users", verifyJWT, userRoute);
router.use("/products", verifyJWT, productRoute);
router.use("/carts", verifyJWT, cartRoute);
router.use("/chats", verifyJWT, chatRoute);
router.use("/orders", verifyJWT, orderRoute);
router.use("/checkout", verifyJWT, stripeRoute);

module.exports = router;