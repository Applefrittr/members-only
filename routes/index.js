const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

////               Home page GET            ////
router.get("/", userController.home);

////              Sign in page GET and POST         ////
router.get("/sign-in", userController.sign_in_GET);
router.post("/sign-in", userController.sign_in_POST);

////              Sign up page GET and POST         ////
router.get("/sign-up", userController.sign_up_GET);
router.post("/sign-up", userController.sign_up_POST);

////               Log out GET                   ////
router.get("/sign-out", userController.log_out);

module.exports = router;
