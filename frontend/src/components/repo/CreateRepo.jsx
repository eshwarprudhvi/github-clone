import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import API_BASE_URL from "../../config";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to create a repository.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/repo/create`, {
        name,
        description,
        visibility,
        owner: userId,
        content: [],
        issues: [],
      });

      if (res.data.success) {
        navigate(`/repo/${res.data.repo._id}`);
      }
    } catch (err) {
      console.error("Error creating repository", err);
      setError(err.response?.data?.error || "Failed to create repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 border-b border-[#30363d] pb-4">
          <h1 className="text-2xl font-semibold text-white">Create a new repository</h1>
          <p className="mt-1 text-[#8b949e]">
            A repository contains all project files, including the revision history.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Repository name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-white focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
              placeholder="my-awesome-project"
            />
            <p className="mt-2 text-xs text-[#8b949e]">
              Great repository names are short and memorable.
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Description <span className="text-[#8b949e] font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-white focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
              placeholder="Briefly describe your project..."
            />
          </div>

          <div className="space-y-4 rounded-md border border-[#30363d] p-4">
            <div className="flex items-start">
              <input
                id="public"
                name="visibility"
                type="radio"
                checked={visibility === true}
                onChange={() => setVisibility(true)}
                className="mt-1 h-4 w-4 border-[#30363d] bg-[#0d1117] text-[#1f6feb] focus:ring-[#1f6feb]"
              />
              <label htmlFor="public" className="ml-3 block">
                <span className="block text-sm font-medium text-white">Public</span>
                <span className="block text-xs text-[#8b949e]">
                  Anyone on the internet can see this repository. You choose who can commit.
                </span>
              </label>
            </div>
            <div className="flex items-start">
              <input
                id="private"
                name="visibility"
                type="radio"
                checked={visibility === false}
                onChange={() => setVisibility(false)}
                className="mt-1 h-4 w-4 border-[#30363d] bg-[#0d1117] text-[#1f6feb] focus:ring-[#1f6feb]"
              />
              <label htmlFor="private" className="ml-3 block">
                <span className="block text-sm font-medium text-white">Private</span>
                <span className="block text-xs text-[#8b949e]">
                  You choose who can see and commit to this repository.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-[#238636] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-[#238636] focus:ring-offset-2 focus:ring-offset-[#0d1117] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create repository"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateRepo;
