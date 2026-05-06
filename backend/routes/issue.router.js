import express from "express";
import { createIssue, deleteIssueById, getAllIssues, getIssueById, updateIssueById } from "../controllers/issue.controller.js";



const issueRouter = express.Router();

issueRouter.post("/issue/create",createIssue);
issueRouter.get("/isuue/all",getAllIssues);
issueRouter.get("/issue/:id",getIssueById);

issueRouter.put("/isuue/update/:id",updateIssueById)
issueRouter.delete("/issue/delete/:id",deleteIssueById)

export default issueRouter 