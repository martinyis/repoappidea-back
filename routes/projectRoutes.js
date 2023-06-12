import express from "express";
import { protect } from "./../controllers/authController.js";
import {
  createProject,
  likeProject,
  getAllProjects,
  getMyProjects,
  updateMyProject,
  deleteMyProject,
} from "../controllers/projectController.js";
const router = express.Router();

router.post("/create", protect, createProject);
router.patch("/like/:id", protect, likeProject);
router.get("/getAll", getAllProjects);
router.get("/getMyProjects", protect, getMyProjects);
router
  .route("/:id")
  .patch(protect, updateMyProject)
  .delete(protect, deleteMyProject);
export default router;
