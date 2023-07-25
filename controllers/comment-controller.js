const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Comment = require("../models/comment");

//  New commnet GET controller
exports.new_comment_GET = (req, res, next) => {
  console.log(req.user)
  res.render("new-comment", { user: req.user });
};

//  New comment POST controller
exports.new_comment_POST = [
  body("text", "Cannot exceed 100 characters")
    .trim()
    .isLength({ max: 100 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new Comment({
      user: req.user._id,
      dated: new Date(),
      text: req.body.text,
    });

    if (!errors.isEmpty()) {
      res.render("new-comment", {
        errors: errors.array(),
        user: req.user,
      });
    } else {
      await comment.save();
      res.redirect("/");
    }
  }),
];
