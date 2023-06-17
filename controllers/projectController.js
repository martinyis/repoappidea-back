import Project from "./../models/projectModel.js";
import { filterObj } from "./userController.js";
import User from "../models/userModel.js";
export const createProject = async (req, res) => {
  console.log("came here");
  try {
    //fidn username by req.body._id
    const newProject = await Project.create({
      name: req.body.name,
      author: req.user._id,
      description: req.body.description,
      developers: req.body.developers,
      techStack: req.body.techStack,
      githubLink: req.body.githubLink,
      authorUserName: req.user.username,
    });

    res.status(201).json({
      status: "success",
      data: {
        project: newProject,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const likeProject = async (req, res) => {
  try {
    //get id from params
    const { id } = req.params;
    //find project by this id
    const project = await Project.findById(id);
    //check if if above already exist in projetc.usersLiked, if yes, then dont changed object if does not exist then add id to usersLiked array
    if (project.usersLiked.includes(req.user._id)) {
      res.status(400).json({
        status: "fail",
        message: "You already liked this project",
      });
    } else {
      project.usersLiked.push(req.user._id);
      await project.save();
      res.status(200).json({
        status: "success",
        data: {
          project,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//get all the projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      status: "success",
      data: {
        projects,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

//getMyProjects

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ author: req.user._id });
    res.status(200).json({
      status: "success",
      data: {
        projects,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
//updatemyproject
export const updateMyProject = async (req, res) => {
  try {
    const filteredBody = filterObj(
      req.body,
      "name",
      "description",
      "developers",
      "techStack",
      "githubLink"
    );
    const project = await Project.findById(req.params.id);
    if (project.author.toString() !== req.user._id.toString()) {
      throw new Error("You are no the author");
    }
    //3) Update user document
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        project: updatedProject,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//delete my project by id
export const deleteMyProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.author.toString() !== req.user._id.toString()) {
      throw new Error("You are no the author");
    }
    //findbyidanddelete
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

//get all projeect where author id is the smae as params id
export const getProjectsByAuthorId = async (req, res) => {
  try {
    const projects = await Project.find({ author: req.params.id });
    res.status(200).json({
      status: "success",
      data: {
        projects,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
