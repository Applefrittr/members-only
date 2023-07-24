const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Comment = require("../models/comment");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Home/Index GET route controller
exports.home = asyncHandler(async (req, res, next) => {
  // pass the session user to views supplied by Passport
  req.session.messages = []; // clear session messages array
  const commentList = await Comment.find()
    .populate("user")
    .sort({ dated: -1 })
    .exec();
  console.log(commentList);
  res.render("index", { title: "The Clubhouse", user: req.user, commentList });
});

// Sign-in GET route controller
exports.sign_in_GET = (req, res, next) => {
  // pass the session to views to gain access to session messages (error messages pushed by Passport stored here)
  res.render("sign-in", { title: "Sign In", session: req.session });
};

// Sign in POST route controller callback - Passport authenticate the user
exports.sign_in_POST = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/sign-in",
  failureMessage: true,
});

// Sign up GET route controller
exports.sign_up_GET = (req, res, next) => {
  res.render("sign-up", { title: "Sign Up" });
};

// Sign-up POST route controller
exports.sign_up_POST = [
  // Validations first
  body("username", "Username must be at least 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password", "Password must be at least 6 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password-confirm", "Passwords must match")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape(),
  // main controller async function
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // create a new User
    const user = new User({
      username: req.body.username,
      joined: new Date(),
    });

    // if Validation fails, re-render the page with error messages
    if (!errors.isEmpty()) {
      res.render("sign-up", { errors: errors.array() });
    } else {
      // query DB for an existing user that matches the input
      const userExists = await User.findOne({
        username: req.body.username,
      }).exec();

      //re-render sign-up with user exists error msg
      if (userExists) {
        res.render("sign-up", {
          exists: "Username already exists",
        });
      } else {
        // if everything passes, hash the password, save user to DB, then redirect to home page
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            console.log(err);
            return;
          } else {
            user.password = hashedPassword;
            await user.save();
            res.redirect("/");
          }
        });
      }
    }
  }),
];

// Log out GET controller
exports.log_out = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

// Membership GET controller
exports.membership_GET = (req, res, next) => {
  res.render("membership", { user: req.user });
};

// Membership POST controller
exports.membership_POST = [
  body("code", "Incorrect passcode")
    .trim()
    .custom((value) => {
      return value === process.env.MEMBERSHIP;
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    console.log(process.env.MEMBERSHIP);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors, errors.array());
      res.render("membership", { errors: errors.array(), user: req.user });
    } else {
      const user = await User.findById(req.user._id);
      user.isMember = true;
      await user.save();
      res.redirect("/");
    }
  }),
];
