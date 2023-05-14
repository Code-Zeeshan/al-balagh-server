const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const exceptionHandler = require("../utils/exceptionHandler");

router.route("/register").post(exceptionHandler(controller.register));
router.route("/login").post(exceptionHandler(controller.login));
router.route("/handleRefreshToken").get(exceptionHandler(controller.handleRefreshToken));
router.route("/logout").get(exceptionHandler(controller.logout));

module.exports = router;