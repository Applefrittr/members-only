const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

// Home page GET
router.get("/", function (req, res, next) {
  res.render("index", { title: "The Clubhouse", user: req.user });
});

router.get("/sign-in", (req, res, next) => {

  res.render("sign-in", { title: "Sign In"});
});

// router.post("/sign-in") moved to app.js to work with passport
router.post("/sign-in", userController.sign_in);

router.get("/sign-up", (req, res, next) => {
  res.render("sign-up", { title: "Sign Up" });
});

router.post("/sign-up", userController.sign_up);

module.exports = router;
