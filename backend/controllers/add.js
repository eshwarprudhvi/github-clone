import fs from "fs/promises";
import path from "path";
export const addRepo = async (filePath) => {
  console.log("add repo to the staging area");
  const repoPath = path.resolve(process.cwd(), ".pgit"); //just create string:an abosolute path
  const stagingPath = path.join(repoPath, "staging"); //creates a relative path
  try {
    await fs.mkdir(stagingPath, { recursive: true }); //- { recursive: true }: This option tells Node.js to create all necessary parent directories if they don’t already exist.
    const fileName = path.basename(filePath);
    await fs.copyFile(fileName, path.join(stagingPath, fileName));
    console.log(`file ${fileName} added to staging area`);
  } catch (error) {
    console.error("error adding file to staging area", error);
  }
};
