const router = require("express").Router();
const controller = require("../controllers/order.controller");
const exceptionHandler = require("../utils/exceptionHandler");

router.route("/addOne").post(exceptionHandler(controller.addOne));
router.route("/updateOne").put(exceptionHandler(controller.updateOne));
router.route("/deleteOne").delete(exceptionHandler(controller.deleteOne));
router.route("/findByUser").get(exceptionHandler(controller.findByUser));
router.route("/findMany").get(exceptionHandler(controller.findMany));
router.route("/dispatchEmail").post(exceptionHandler(controller.dispatchEmail));
router.route("/getIncome").get(exceptionHandler(controller.getIncome));

module.exports = router;