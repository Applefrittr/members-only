// import Mongoose
const mongoose = require("mongoose");

// Define the Comment Schema to work with MongoDB
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  text: {type: String, required: true, minLength: 1, maxLength: 200, trine: true},
  dated: Date,
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

// export model to be used by controllers
module.exports = mongoose.model("Comments", CommentSchema);
