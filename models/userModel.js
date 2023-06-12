import crypto from "crypto";
import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email is not valid"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: 8,
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
