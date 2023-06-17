import express from "express";
import { signup, login, protect } from "./../controllers/authController.js";
import {
  edit,
  getAllUsers,
  getUserById,
  deleteUser,
  getMe,
} from "./../controllers/userController.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.patch("/edit", protect, edit);
router.post("/me", protect, getMe);
router.get("/allusers", getAllUsers);
router.route("/:id").get(getUserById);
router.delete("/delete", protect, deleteUser);
export default router;
