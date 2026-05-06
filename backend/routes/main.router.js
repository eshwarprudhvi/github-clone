import express from "express";
import userRouter from "./user.route.js";
import repoRouter from "./repo.router.js";
import issueRouter from "./issue.router.js";
const mainRouter = express.Router();

mainRouter.use(userRouter)
mainRouter.use(repoRouter)
mainRouter.use(issueRouter)


export default mainRouter;