import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
export const commitRepo = async (message) => {
  const repoPath = path.resolve(process.cwd(), ".pgit");
  const stagedPath = path.join(repoPath, "staging");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitsPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);
    //move files from staging area to the commit dir
    for (let file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file)
      );
    }
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );

    console.log(`commit ${commitId} created with message ${message}`);
  } catch (error) {
    console.error("Error while commit", error);
  }
};
