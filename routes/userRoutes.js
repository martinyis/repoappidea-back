import express from "express";
import { signup, login, protect } from "./../controllers/authController.js";
import {
  edit,
  getAllUsers,
  getUserById,
  deleteUser,
} from "./../controllers/userController.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.patch("/edit", protect, edit);
router.get("/allusers", protect, getAllUsers);
router.route("/:id").get(protect, getUserById);
router.delete("/delete", protect, deleteUser);
export default router;
