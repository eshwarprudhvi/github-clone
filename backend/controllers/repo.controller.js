import mongoose from "mongoose";
import Repo from "../models/repository.model.js";
import repoValidation from "../validations/repo.validations.js";
export const createRepo = async (req, res) => {
  try {
    const { name, description, content, visibility, owner, issues } = req.body;
    const validationResult = repoValidation.safeParse({
      name,
      description,
      content,
      visibility,
      owner,
      issues,
    });
    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error.issues[0].message,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({
        error: "invalid owner id",
      });
    }
    const repo = new Repo(validationResult.data);
    await repo.save();
    return res.status(201).json({
      success: true,
      message: "repository created successfully",
      repo,
    });
  } catch (error) {
    console.error("error during creation of repo", error);
    return res.status(500).json({
      success: false,
      message: "Server error during repository creation",
      error: error.message,
    });
  }
};

export const getAllRepositories = async (req, res) => {
  try {
    const repos = await Repo.find().populate("owner").populate("issues");

    return res.status(200).json({
      success: true,
      message: "repos found",
      repos,
    });
  } catch (error) {
    console.error("error during fetching of repositories", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching repositories",
    });
  }
};

export const getRepoById = async (req, res) => {
  const repoId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(repoId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Repository ID",
    });
  }

  try {
    const repo = await Repo.findById(repoId)
      .populate("owner")
      .populate("issues");

    if (!repo) {
      return res.status(404).json({
        message: "repo not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "repo found",
      repo,
    });
  } catch (error) {
    console.error("error fetching repo by id", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching repository",
    });
  }
};
export const getRepoByName = async (req, res) => {
  const repoName = req.params.name;
  try {
    const repo = await Repo.find({ name: repoName })
      .populate("owner")
      .populate("issues");
    if (!repo || repo.length === 0) {
      return res.status(404).json({
        message: "repo not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "repo found",
      repo,
    });
  } catch (error) {
    console.error("error during fetching of repo", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching repository by name",
    });
  }
};

export const getReposCurrentUser = async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User ID",
    });
  }

  try {
    const repos = await Repo.find({ owner: userId })
      .populate("owner")
      .populate("issues");

    return res.status(200).json({
      success: true,
      message: repos.length === 0 ? "no repos found" : "repo found",
      repos,
    });
  } catch (error) {
    console.error("error during fetching of repo", error);
    return res.status(500).json({
      success: false,
      message: "error during fetching of repo",
      error: error.message,
    });
  }
};

export const updateRepoById = async (req, res) => {
  const repoId = req.params.id;
  const { description, content } = req.body;
  try {
    const repo = await Repo.findById(repoId);
    if (!repo) {
      return res.status(404).json({
        message: "repo not found",
      });
    }
    repo.description = description;
    repo.content.push(...content);
    await repo.save();
    return res.status(200).json({
      success: true,
      message: "repo updated",
      repo,
    });
  } catch (error) {
    console.error("error during updating of repo", error);
    return res.status(500).json({
      success: false,
      message: "Error updating repository",
    });
  }
};

export const toggleVisibilityById = async (req, res) => {
  const repoId = req.params.id;
  const repo = await Repo.findById(repoId);
  if (!repo) {
    return res.status(404).json({
      message: "repo not found",
    });
  }
  repo.visibility = !repo.visibility;
  await repo.save();
  return res.status(200).json({
    success: true,
    message: "repo visibility toggled",
    repo,
  });
};

export const deleteRepoById = async (req, res) => {
  const repoId = req.params.id;
  const repo = await Repo.findById(repoId);
  if (!repo) {
    return res.status(404).json({
      message: "repo not found",
    });
  }
  await Repo.deleteOne({ _id: repoId });
  return res.status(200).json({
    success: true,
    message: "repo deleted",
  });
};
