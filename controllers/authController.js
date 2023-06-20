import { promisify } from "util";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "./../models/userModel.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    httpOnly: true,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
export const signup = async (req, res) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message:
        err.code === 11000 ? "Username or email already exists" : err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //1) if email and passwords exits
    if (!email || !password) {
      //throwing new error without using next
      throw new Error("Incorret email or password");
    }
    //2) Check if a user exists and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorret email or password");
    }
    //3) If everything is ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new Error("You are not logged in! Please log in to get access");
    }
    //2) Verification Validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      throw new Error("The usere belonging to this token no longer exist");
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
