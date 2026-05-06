import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js"
import { generateToken } from "../services/user.services.js";

dotenv.config();

const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      username,
      email,
            password:hashedPassword,
            repositorios:[],
            followedUsers:[],
            starRepositories:[]
         })
       const result = await collection.insertOne(newUser);
    const token = generateToken(result._id);

    res.cookie("token", token);
    res.status(201).json({ message: "User created successfully", result, token });
  } catch (error) {
    res.status(500).json({ message: "Error during signup", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token);
    res.status(200).json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
    const id=req.params.id;
    try{    
    const user=await User.findById(id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    res.status(200).json(user);
    }catch(error){
        res.status(500).json({message:"Error fetching user profile",error:error.message});
    }
};

const updateUserProfile = async (req, res) => {
    const id=req.params.id;
    try{
        const user=await User.findById(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.username=req.body.username;
        user.email=req.body.email;
        user.password=await bcryptjs.hash(req.body.password,10);
        const result=await user.save();
        res.status(200).json({message:"User profile updated successfully",result});
    }catch(error){
        res.status(500).json({message:"Error updating user profile",error:error.message});
    }
};

const deleteUser = async (req, res) => {
    const id=req.params.id;
    try{
        const user=await User.findById(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const result=await user.remove();
        res.status(200).json({message:"User deleted successfully",result});
    }catch(error){
        res.status(500).json({message:"Error deleting user",error:error.message});
    }
};

export {
  allUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUser
};
