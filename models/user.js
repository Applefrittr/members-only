// import Mongoose
const mongoose = require("mongoose");

// Define the User Schema to work with MongoDB
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, trim: true, required: true, maxLength: 20 },
  password: { type: String },
  joined: Date,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  isAdmin: Boolean,
  isMember: Boolean,
});

// export model to be used by controllers
module.exports = mongoose.model("Users", UserSchema);
