import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { generateToken } from "../services/user.services.js";
import {
  loginValidation,
  signupValidation,
} from "../validations/user.validations.js";

dotenv.config();

const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User or email already exists" });
    }

    const validateData = signupValidation.parse({
      username,
      email,
      password,
    });

    const hashedPassword = await bcryptjs.hash(validateData.password, 10);
    const newUser = new User({
      username: validateData.username,
      email: validateData.email,
      password: hashedPassword,
      repositorios: [],
      followedUsers: [],
      starRepositories: [],
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);

    res.cookie("token", token);
    res.status(201).json({
      message: "User created successfully",
      result: savedUser,
      token,
      userId: savedUser._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during signup", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token);
    res
      .status(200)
      .json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const followersCount = await User.countDocuments({ followedUsers: id });
    
   
    const userData = user.toObject();
    userData.followersCount = followersCount;
    
    res.status(200).json(userData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = req.body.username;

    if (req.body.password) {
      user.password = await bcryptjs.hash(req.body.password, 10);
    }

    const result = await user.save();
    res
      .status(200)
      .json({ message: "User profile updated successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

const followUser = async (req, res) => {
  const currentUserId = req.params.currentUserId;
  const userToFollowId = req.params.userToFollowId;

  try {
    if (String(currentUserId) === String(userToFollowId)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userToFollowId);

    if (!currentUser || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following (convert to string for comparison)
    const isAlreadyFollowing = currentUser.followedUsers.some(
      (id) => String(id) === String(userToFollowId)
    );
    if (isAlreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to followedUsers array
    currentUser.followedUsers.push(userToFollowId);
    await currentUser.save();

    res.status(200).json({
      message: "User followed successfully",
      followedUsers: currentUser.followedUsers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error following user", error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  const currentUserId = req.params.currentUserId;
  const userToUnfollowId = req.params.userToUnfollowId;

  try {
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if following (convert to string for comparison)
    const isFollowing = currentUser.followedUsers.some(
      (id) => String(id) === String(userToUnfollowId)
    );
    if (!isFollowing) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Remove from followedUsers array
    currentUser.followedUsers = currentUser.followedUsers.filter(
      (id) => String(id) !== String(userToUnfollowId)
    );
    await currentUser.save();

    res.status(200).json({
      message: "User unfollowed successfully",
      followedUsers: currentUser.followedUsers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unfollowing user", error: error.message });
  }
};

export {
  allUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  followUser,
  unfollowUser,
};
