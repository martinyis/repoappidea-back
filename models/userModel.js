import crypto from "crypto";
import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    maxlength: [30, "A fullname must have less than or equal to 30 characters"],
    minlength: [5, "A fullname must have more than or equal to 5 characters"],
    validate: [
      {
        validator: (value) => {
          const regex = /^[A-Za-z\s]+$/;
          return regex.test(value);
        },
        message: "Full name must only contain letters and spaces",
      },
    ],
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
    unique: [true, "User with this username already exists"],
    maxlength: [20, "A username must have less or equal then 20 characters"],
    minlength: [5, "A username must have more or equal then 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: [true, "User with this email already exists"],
    validate: [validator.isEmail, "Email is not valid"],
  },
  techStack: {
    type: [String],
    default: ["Javascript", "Python"],
  },
  position: {
    type: String,
    default: "Developer",
    maxlength: [
      20,
      "A poistion type must have less or equal then 20 characters",
    ],
    minlength: [5, "A poistion type must have more or equal then 5 characters"],
  },
  githubLink: {
    type: String,
    default: "https://github.com/",
    validate: [validator.isURL, "Link is not valid"],
  },
  linkedinLink: {
    type: String,
    default: "https://www.linkedin.com/",
    validate: [validator.isURL, "Link is not valid"],
  },
  avatarUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/dxkufsejm/image/upload/v1620220366/avatars/default-avatar.png",
    validate: [validator.isURL, "Link is not valid"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
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
