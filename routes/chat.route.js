const router = require("express").Router();
const exceptionHandler = require("../utils/exceptionHandler");
const controller = require("../controllers/chat.controller");

router.route("/findOne").post(exceptionHandler(controller.findOne));
router.route("/handleChat").post(exceptionHandler(controller.handleChat));


module.exports = router;