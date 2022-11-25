const router = require("express").Router();
const exceptionHandler = require("../utils/exceptionHandler");
const controller = require("../controllers/product.controller");

router.route("/addOne").post(exceptionHandler(controller.addOne));
router.route("/updateOne").put(exceptionHandler(controller.updateOne));
router.route("/deleteOne").delete(exceptionHandler(controller.deleteOne));
router.route("/findMany").get(exceptionHandler(controller.findMany));
router.route("/findOne").get(exceptionHandler(controller.findOne));


module.exports = router;