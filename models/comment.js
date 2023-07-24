// import Mongoose
const mongoose = require("mongoose");
const { DateTime } = require('luxon')

// Define the Comment Schema to work with MongoDB
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  text: {type: String, required: true, minLength: 1, maxLength: 200, trine: true},
  dated: Date,
  //likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

CommentSchema.virtual("dated_formatted").get(function () {
  return DateTime.fromJSDate(this.dated).toLocaleString(DateTime.DATETIME_FULL);
});

// export model to be used by controllers
module.exports = mongoose.model("Comments", CommentSchema);
