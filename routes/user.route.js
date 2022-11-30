const router = require("express").Router();
const controller = require("../controllers/user.controller");
const exceptionHandler = require("../utils/exceptionHandler");

router.route("/updateOne/:id").post(exceptionHandler(controller.updateOne));
router.route("/deleteOne/:id").post(exceptionHandler(controller.deleteOne));
router.route("/findOne").get(exceptionHandler(controller.findOne));
router.route("/stats").post(exceptionHandler(controller.stats));


module.exports = router;