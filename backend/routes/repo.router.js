import express from "express";
import {
  createRepo,
  deleteRepoById,
  getAllRepositories,
  getRepoById,
  getRepoByName,
  getReposCurrentUser,
  toggleVisibilityById,
  updateRepoById,
} from "../controllers/repo.controller.js";

const repoRouter = express.Router();

repoRouter.post("/repo/create", createRepo);
repoRouter.get("/repo/all", getAllRepositories);
repoRouter.get("/repo/:id", getRepoById);
repoRouter.get("/repo/name/:name", getRepoByName);
repoRouter.get("/repo/user/:userId", getReposCurrentUser);
repoRouter.put("/repo/update/:id", updateRepoById);
repoRouter.delete("/repo/delete/:id", deleteRepoById);
repoRouter.patch("/repo/toggle/:id", toggleVisibilityById);

export default repoRouter;
