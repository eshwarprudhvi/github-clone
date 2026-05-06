import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/github-clone";

const seedUsers = [
  {
    username: "bob_builder",
    email: "bob@example.com",
    password: "password123",
  },
  {
    username: "charlie_brown",
    email: "charlie@example.com",
    password: "password123",
  },
  {
    username: "diana_prince",
    email: "diana@example.com",
    password: "password123",
  },
  {
    username: "evan_mitchell",
    email: "evan@example.com",
    password: "password123",
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    for (const user of seedUsers) {
      const existingUser = await User.findOne({
        $or: [{ email: user.email }, { username: user.username }],
      });

      if (existingUser) {
        console.log(`✓ User already exists: ${user.username}`);
      } else {
        const hashedPassword = await bcryptjs.hash(user.password, 10);
        const newUser = new User({
          username: user.username,
          email: user.email,
          password: hashedPassword,
          repositories: [],
          followedUsers: [],
          starRepositories: [],
        });

        const savedUser = await newUser.save();
        console.log(`✓ Created user: ${savedUser.username} (${savedUser._id})`);
      }
    }

    console.log("\n✅ Seeding complete!");
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
