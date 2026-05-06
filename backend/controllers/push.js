import fs from "fs/promises";
import path from "path";
import { Dropbox } from "dropbox";
import dotenv from "dotenv";
import fetch from "node-fetch";
import connectDB from "../config/db.js";
import Repo from "../models/repository.model.js";

dotenv.config();

export const pushRepo = async () => {
  const repoPath = path.resolve(process.cwd(), ".pgit");
  const commitsPath = path.join(repoPath, "commits");
  const configPath = path.join(repoPath, "config.json");

  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    console.error(
      "Error: DROPBOX_ACCESS_TOKEN not set in environment variables"
    );
    process.exit(1);
  }

  const dbx = new Dropbox({ accessToken, fetch });

  try {
    
    let repoId = "";
    try {
      const config = JSON.parse(await fs.readFile(configPath, "utf-8"));
      repoId = config.repoId;
    } catch (err) {
      console.warn("Warning: Could not read config.json or repoId not found.");
    }

    const commitDirs = await fs.readdir(commitsPath);
    console.log(`Found ${commitDirs.length} potential commits to push...`);

    const pushedFiles = new Set();

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(commitPath);

      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        pushedFiles.add(file);

        // Upload to Dropbox
        const dropboxPath = `/github-clone/${commitDir}/${file}`;
        
        try {
          await dbx.filesUpload({
            path: dropboxPath,
            contents: fileContent,
            mode: { ".tag": "overwrite" },
          });
          console.log(`Uploaded to Dropbox: ${dropboxPath}`);
        } catch (uploadError) {
          if (uploadError.error && uploadError.error['.tag'] === 'expired_access_token') {
            console.error("Dropbox Error: Your access token has expired. Please update it in your .env file.");
          } else {
            console.error(`Failed to upload ${file} to Dropbox:`, uploadError.error || uploadError);
          }
          console.log("Continuing to update MongoDB database anyway...");
        }
      }
    }

    // 2. Update MongoDB if repoId is available
    if (repoId && pushedFiles.size > 0) {
      console.log("Updating MongoDB repository record...");
      await connectDB();
      
      const repo = await Repo.findById(repoId);
      if (repo) {
        
        const currentContent = new Set(repo.content);
        pushedFiles.forEach(file => currentContent.add(file));
        repo.content = Array.from(currentContent);
        
        await repo.save();
        console.log("MongoDB record updated successfully!");
      } else {
        console.error(`Error: Repository with ID ${repoId} not found in database.`);
      }
    } else if (!repoId) {
      console.log("Note: No Repository ID found in config. Local files pushed to Dropbox but database not updated.");
    }

    console.log("Push process completed!");
    process.exit(0);
  } catch (error) {
    console.error("Push error:", error);
    process.exit(1);
  }
};

