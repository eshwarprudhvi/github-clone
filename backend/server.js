import { init } from "./controllers/init.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers"; // strips the first 2 cli args
import { commitRepo } from "./controllers/commit.js";
import { pullRepo } from "./controllers/pull.js";
import { pushRepo } from "./controllers/push.js";
import { addRepo } from "./controllers/add.js";
import { revertRepo } from "./controllers/revert.js";

import http from "http";
import { Server } from "socket.io";


import dotenv from "dotenv";
import mongoose from "mongoose";

import cors from "cors";
import express from "express";
import mainRouter from "./routes/main.router.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();



yargs(hideBin(process.argv))
  .command(
    "init [repoId]",
    "initiate a new repo",
    (yargs) => {
      yargs.positional("repoId", {
        description: "MongoDB Repository ID to link to",
        type: "string",
      });
    },
    async (argv) => {
      await init(argv.repoId);
    }
  )
  .command(
    "add <filePath>",
    "add to repo",
    (yargs) => {
      yargs.positional("filePath", {
        description: "file to add to staging area",
        type: "string",
        demandOption: true,
      });
    },
    async (argv) => {
      await addRepo(argv.filePath);
    }
  )
  .command(
    "commit <message>",
    "push file to github",
    (yargs) => {
      yargs.positional("message", {
        description: "commit to github",
        type: "string",
      });
    },
    async (argv) => {
      await commitRepo(argv.message);
    }
  )
  .command("pull", "pull from github", {}, pullRepo)
  .command("push", "push to github", {}, pushRepo)
  .command(
    "revert <commitId>",
    "revert the commit",
    (yargs) => {
      yargs.positional("commitId", {
        description: "revert",
        type: "string",
      });
    },
    async (argv) => {
      await revertRepo(argv.commitId);
    }
  )
  .parse();


import connectDB from "./config/db.js";

const startServer = async () => {
  const PORT = process.env.PORT || 8000;
  const app = express();
  app.use(cors({ origin: "*" }));

  app.use(express.json());

  app.use("/", mainRouter);

 

  await connectDB();

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`user connected`);
    socket.on("joinRoom", (userId) => {
      console.log("Joined room:", userId);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Only start the server if no command-line arguments are provided
if (process.argv.length === 2) {
  startServer();
}
