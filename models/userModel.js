import crypto from "crypto";
import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    maxlength: [30, "A fullname must have less or equal then 20 characters"],
    minlength: [5, "A fullname must have more or equal then 5 characters"],
    validate: [validator.isAlpha, "Full name must only contain characters"],
    default: "FullName",
  },
  description: {
    type: String,
    maxlength: [
      400,
      "A description must have less or equal then 400 characters",
    ],
    minlength: [10, "A description must have more or equal then 10 characters"],
    default: "Description",
  },
  username: {
    type: String,
    required: [true, "Please provide your username"],
    unique: true,
    maxlength: [20, "A username must have less or equal then 20 characters"],
    minlength: [5, "A username must have more or equal then 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email is not valid"],
  },
  techStack: {
    type: [String],
    default: ["Javascript, Python"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "Passwords are not the same",
    },
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  //projects ids
});

userSchema.pre("save", async function (next) {
  //Only run this function if password was actually modiied
  if (!this.isModified("password")) return next();
  //Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete the passwrodConfirm
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre(/^find/, function (next) {
  //this point to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
