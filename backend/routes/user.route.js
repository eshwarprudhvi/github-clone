import express from "express";
import { allUsers, deleteUser, login, signup, updateUserProfile, getUserProfile, followUser, unfollowUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/allUsers", allUsers);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/profile/:id", getUserProfile);
userRouter.put("/update/:id", updateUserProfile);
userRouter.delete("/delete/:id", deleteUser);
userRouter.post("/follow/:currentUserId/:userToFollowId", followUser);
userRouter.post("/unfollow/:currentUserId/:userToUnfollowId", unfollowUser);

export default userRouter;
