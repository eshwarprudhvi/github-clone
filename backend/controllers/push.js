import fs from "fs/promises";
import path from "path";
import { Dropbox } from "dropbox";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export const pushRepo = async () => {
  const repoPath = path.resolve(process.cwd(), ".pgit");
  const commitsPath = path.join(repoPath, "commits");

  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    console.error(
      "Error: DROPBOX_ACCESS_TOKEN not set in environment variables"
    );
    process.exit(1);
  }

  const dbx = new Dropbox({ accessToken, fetch });

  try {
    const commitDirs = await fs.readdir(commitsPath);
    console.log(`Found ${commitDirs.length} potential commits to push...`);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(commitPath);

      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        // Upload to Dropbox
        const dropboxPath = `/github-clone/${commitDir}/${file}`;
        
        try {
          await dbx.filesUpload({
            path: dropboxPath,
            contents: fileContent,
            mode: { ".tag": "overwrite" },
          });
          console.log(`Uploaded: ${dropboxPath}`);
        } catch (uploadError) {
          console.error(`Failed to upload ${file}:`, uploadError.error || uploadError);
        }
      }
    }
    console.log("Push process completed!");
  } catch (error) {
    console.error("Push error:", error);
    process.exit(1);
  }
};

