import fs from "fs/promises";
import path from "path";

export const init = async () => {
  try {
    const repoPath = path.resolve(process.cwd(), ".pgit");
    const commitPath = path.join(repoPath, "commits");
    const stagingPath = path.join(repoPath, "staging");

    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitPath, { recursive: true });
    await fs.mkdir(stagingPath, { recursive: true });

    const config = {
      accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    };

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify(config, null, 2)
    );

    console.log("Initialized a new pgit repository");
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
};

