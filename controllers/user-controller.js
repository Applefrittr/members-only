const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Sign-up POST route controller
exports.sign_up = [
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

// Sign in POST route controller callback
exports.sign_in = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/sign-in",
});
