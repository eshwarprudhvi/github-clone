import fs from "fs/promises";
import path from "path";
import { Dropbox } from "dropbox";


export const pullRepo = async () => {
  const repoPath = path.resolve(process.cwd(), ".pgit");
  const commitsPath = path.join(repoPath, "commits");

  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    console.error(
      "Error: DROPBOX_ACCESS_TOKEN not set in environment variables"
    );
    process.exit(1);
  }

  const dbx = new Dropbox({ accessToken });

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });

    console.log("Fetching files from Dropbox...");

    // List files in the github-clone folder 
    const listResult = await dbx.filesListFolder({ path: "/github-clone" });

    for (const entry of listResult.result.entries) {
      if (entry[".tag"] === "folder") {
        
        const commitId = entry.name;
        const commitPath = path.join(commitsPath, commitId);

        
        await fs.mkdir(commitPath, { recursive: true });

        
        const commitFilesResult = await dbx.filesListFolder({
          path: `/github-clone/${commitId}`,
        });

        for (const fileEntry of commitFilesResult.result.entries) {
          if (fileEntry[".tag"] === "file") {
            const fileName = fileEntry.name;
            const dropboxPath = `/github-clone/${commitId}/${fileName}`;

            
            const downloadResult = await dbx.filesDownload({
              path: dropboxPath,
            });

            
            const filePath = path.join(commitPath, fileName);
            const fileBuffer = downloadResult.result.fileBinary;
            await fs.writeFile(filePath, fileBuffer);
            console.log(` Downloaded: ${dropboxPath}`);
          }
        }
      }
    }
    console.log("All files pulled from Dropbox successfully!");
  } catch (error) {
    console.error("Pull error:", error);
    process.exit(1);
  }
};
