import fs from "fs";
import path from "path";
import { promisify } from "util"; // returns a new function that returns a Promise.

const readDir = promisify(fs.readdir);
const copyfile = promisify(fs.copyFile);
export const revertRepo = async (commitId) => {
  const repoPath = path.resolve(process.cwd(), ".pgit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitId);
    const files = await readDir(commitDir);
    const parentDir = path.join(repoPath, "..");

    for (const file of files) {
      await copyfile(path.join(commitDir, file), path.join(parentDir, file));
    }
    console.log(`commit ${commitId} reverted successfully`);
  } catch (error) {
    console.error("error while reverting ", error);
  }
};
