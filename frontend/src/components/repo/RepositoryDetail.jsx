import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import API_BASE_URL from "../../config";

const RepositoryDetail = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/repo/${id}`);
        setRepo(res.data.repo);
      } catch (err) {
        console.error("Error fetching repo details", err);
        setError("Failed to load repository details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <p className="text-[#8b949e]">Loading repository content...</p>
        </div>
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <Navbar />
        <div className="mx-auto max-w-4xl p-6">
          <p className="text-red-500">{error || "Repository not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <Navbar />
      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-8 rounded-lg border border-[#30363d] bg-[#161b22] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#58a6ff]">{repo.name}</h1>
              <p className="mt-2 text-[#8b949e]">
                {repo.description || "No description provided"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full border border-[#30363d] px-3 py-1 text-xs font-medium text-[#8b949e]">
                {repo.visibility ? "Public" : "Private"}
              </span>
              <div className="mt-2 flex items-center gap-2 rounded-md bg-[#0d1117] p-2 text-xs">
                <span className="text-[#8b949e]">Repo ID:</span>
                <code className="font-mono text-[#c9d1d9]">{repo._id}</code>
                
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-[#30363d] pt-4">
             <p className="text-xs text-[#8b949e]">
               To link this to your local project, use: 
               <code className="ml-2 rounded bg-[#0d1117] px-1 py-0.5 text-[#c9d1d9]">node server.js init {repo._id}</code>
             </p>
          </div>
        </div>

        <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden">
          <div className="border-b border-[#30363d] bg-[#0d1117] px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Files</h3>
          </div>
          <div className="divide-y divide-[#30363d]">
            {repo.content && repo.content.length > 0 ? (
              repo.content.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#1f6feb]/5"
                >
                  <svg
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    className="fill-[#8b949e]"
                  >
                    <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v9.086A1.75 1.75 0 0 1 13.75 16H3.75A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h10a.25.25 0 0 0 .25-.25V5.25h-3.25a.75.75 0 0 1-.75-.75V1.5Zm9.25 3.75h-2.5v-2.5l2.5 2.5Z"></path>
                  </svg>
                  <span className="text-sm font-medium hover:text-[#58a6ff] hover:underline cursor-pointer">
                    {file}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-[#8b949e]">
                  This repository is empty. Push some files to see them here!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryDetail;
