import mongoose from "mongoose";
import dotenv from "dotenv";
import Repository from "../models/repository.model.js";

dotenv.config();

const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/github-clone";

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");

    // Customize these sample repos as needed
    const sampleRepos = [
      {
        name: "example-repo-11",
        description: "Sample repository created by seed script",
        content: ["README.md"],
        visibility: true,
        // set owner to null or provide an actual user ObjectId string
        owner: "69faee3b5f5f6cda0f8e5c2d",
      },
      {
        name: "example-repo-21",
        description: "Another seeded repo",
        content: ["index.js"],
        visibility: false,
        owner: "69faee3b5f5f6cda0f8e5c2d",
      },
    ];

    for (const repoData of sampleRepos) {
      // Skip if repo with same name exists
      const existing = await Repository.findOne({ name: repoData.name });
      if (existing) {
        console.log(`Repo ${repoData.name} already exists, skipping`);
        continue;
      }
      const repo = new Repository(repoData);
      await repo.save();
      console.log(`Created repo: ${repo.name}`);
    }

    await mongoose.disconnect();
    console.log("Seeding complete, disconnected");
  } catch (err) {
    console.error("Seeding failed", err);
    process.exit(1);
  }
};

seed();
