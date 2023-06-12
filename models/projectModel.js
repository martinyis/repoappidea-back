import crypto from "crypto";
import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
import bcrypt from "bcryptjs";
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your project name"],
    unique: true,
    maxlength: [
      20,
      "A project name must have less or equal then 20 characters",
    ],
    minlength: [5, "A project name must have more or equal then 5 characters"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    maxlength: [
      150,
      "A project name must have less or equal then 20 characters",
    ],
    minlength: [10, "A project name must have more or equal then 5 characters"],
    default: "This is project from github",
  },
  developers: {
    type: [String],
    default: ["Developer"],
  },
  techStack: {
    type: [String],
    default: ["Javascript, Python"],
  },
  githubLink: {
    type: String,
    default: "https://github.com/",
    validate: [validator.isURL, "Link is not valid"],
  },
  usersLiked: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
