const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");
const commentController = require("../controllers/comment-controller");

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

////               Become Member GET and POST            ////
router.get("/membership", userController.membership_GET);
router.post("/membership", userController.membership_POST);

////               New Comment GET and POST             ////
router.get("/new-comment", commentController.new_comment_GET);
router.post("/new-comment", commentController.new_comment_POST);

module.exports = router;
