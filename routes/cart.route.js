const router = require("express").Router();
const controller = require("../controllers/cart.controller");
const exceptionHandler = require("../utils/exceptionHandler");

router.route("/addOne").post(exceptionHandler(controller.addOne));
router.route("/updateOne").put(exceptionHandler(controller.updateOne));
router.route("/deleteOne").delete(exceptionHandler(controller.deleteOne));
router.route("/findByUserId").get(exceptionHandler(controller.findByUserId));
router.route("/findMany").get(exceptionHandler(controller.findMany));

module.exports = router;