import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import API_BASE_URL from "../../config";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [suggestedQuery, setSuggestedQuery] = useState("");
  const [filteredSuggested, setFilteredSuggested] = useState([]);
  const [searchResult, setSearchResults] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const [repoError, setRepoError] = useState("");
  const [suggestedError, setSuggestedError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [followedUsersList, setFollowedUsersList] = useState([]);
  const [starredReposList, setStarredReposList] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchRepos = async () => {
      try {
        setLoadingRepos(true);
        setRepoError("");
        if (!userId) {
          setRepositories([]);
          setLoadingRepos(false);
          return;
        }
        const res = await axios.get(
          `${API_BASE_URL}/repo/user/${userId}`
        );
        setRepositories(res.data?.repos || []);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch repositories", error);
        setRepoError("Unable to load your repositories.");
        setRepositories([]);
      } finally {
        setLoadingRepos(false);
      }
    };

    const fetchSuggestedRepos = async () => {
      try {
        setLoadingSuggested(true);
        setSuggestedError("");
        const res = await axios.get(`${API_BASE_URL}/repo/all`);
        setSuggestedRepositories(res.data?.repos || []);
        console.log("suggested repos (all)", res.data);
      } catch (error) {
        console.error("Failed to fetch repositories", error);
        setSuggestedError("Unable to load suggestions.");
        setSuggestedRepositories([]);
      } finally {
        setLoadingSuggested(false);
      }
    };

    fetchRepos();
    fetchSuggestedRepos();

    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user/allUsers");
        setAllUsers(res.data || []);
      } catch (error) {
        console.error("Failed to fetch all users", error);
        setAllUsers([]);
      }
    };

    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(
          `${API_BASE_URL}/user/profile/${userId}`
        );
        setProfile(res.data || null);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setProfile(null);
      }
    };

    fetchAllUsers();
    fetchProfile();
  }, []);

  useEffect(() => {
    // compute followed users and starred repos when dependencies change
    if (profile && allUsers.length > 0) {
      const followedIds = profile.followedUsers || [];
      setFollowedUsersList(
        allUsers.filter((u) =>
          followedIds.some((id) => String(id) === String(u._id))
        )
      );
    } else {
      setFollowedUsersList([]);
    }

    if (profile) {
      const starredIds = profile.starRepositories || [];
      const allRepos = [...suggestedRepositories, ...repositories];
      const uniqueRepos = {};
      allRepos.forEach((r) => {
        uniqueRepos[String(r._id)] = r;
      });
      setStarredReposList(
        starredIds.map((id) => uniqueRepos[String(id)]).filter(Boolean)
      );
    } else {
      setStarredReposList([]);
    }
  }, [profile, allUsers, suggestedRepositories, repositories]);

  useEffect(() => {
    if (searchQuery.trim() == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  useEffect(() => {
    if (suggestedQuery.trim() === "") {
      setFilteredSuggested(suggestedRepositories);
      return;
    }
    const q = suggestedQuery.toLowerCase();
    setFilteredSuggested(
      suggestedRepositories.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q)
      )
    );
  }, [suggestedQuery, suggestedRepositories]);

  return (
    <>
      <Navbar />
      <section className="min-h-[calc(100vh-72px)] bg-[#0d1117] px-4 py-6 text-[#c9d1d9] sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_280px]">
          <aside className="rounded-lg border border-[#30363d] bg-[#161b22] p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8b949e]">
              Suggested Repositories
            </h3>
            <div className="mb-3">
              <input
                value={suggestedQuery}
                onChange={(e) => setSuggestedQuery(e.target.value)}
                placeholder="Search suggestions"
                className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#c9d1d9] placeholder:text-[#8b949e] focus:border-[#1f6feb] focus:outline-none"
              />
            </div>
            {loadingSuggested && (
              <p className="text-sm text-[#8b949e]">Loading suggestions...</p>
            )}
            {suggestedError && (
              <p className="rounded-md border border-[#f85149]/40 bg-[#f85149]/10 px-3 py-2 text-sm text-[#ff7b72]">
                {suggestedError}
              </p>
            )}
            {!loadingSuggested &&
              !suggestedError &&
              filteredSuggested.length === 0 && (
                <p className="text-sm text-[#8b949e]">
                  No suggestions match your search.
                </p>
              )}
            <div className="space-y-3">
              {filteredSuggested.slice(0, 6).map((repo) => (
                <div
                  key={repo._id}
                  onClick={() => navigate(`/repo/${repo._id}`)}
                  className="rounded-md border border-[#30363d] bg-[#0d1117] p-3 cursor-pointer transition hover:border-[#1f6feb]"
                >
                  <h4 className="truncate text-sm font-semibold text-[#58a6ff]">
                    {repo.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-[#8b949e]">
                    {repo.description || "No description provided"}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <main className="rounded-lg border border-[#30363d] bg-[#161b22] p-4 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 border-b border-[#30363d] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Your Repositories
                </h2>
                <p className="text-sm text-[#8b949e]">
                  Manage and search your projects in one place.
                </p>
              </div>
              <div className="w-full sm:w-[320px]">
                <input
                  className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm text-[#c9d1d9] placeholder:text-[#8b949e] focus:border-[#1f6feb] focus:outline-none focus:ring-2 focus:ring-[#1f6feb]/40"
                  type="text"
                  placeholder="Search your repositories"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loadingRepos && (
              <p className="text-sm text-[#8b949e]">
                Loading your repositories...
              </p>
            )}
            {repoError && (
              <p className="mb-4 rounded-md border border-[#f85149]/40 bg-[#f85149]/10 px-3 py-2 text-sm text-[#ff7b72]">
                {repoError}
              </p>
            )}
            {!loadingRepos && !repoError && searchResult.length === 0 && (
              <div className="rounded-md border border-dashed border-[#30363d] bg-[#0d1117] p-6 text-center">
                <p className="text-sm text-[#8b949e]">
                  {searchQuery.trim()
                    ? "No repositories match your search."
                    : "You do not have repositories yet."}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {searchResult.map((repo) => (
                <div
                  key={repo._id}
                  onClick={() => navigate(`/repo/${repo._id}`)}
                  className="rounded-md border border-[#30363d] bg-[#0d1117] p-4 transition hover:border-[#1f6feb] cursor-pointer"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="truncate text-base font-semibold text-[#58a6ff]">
                      {repo.name}
                    </h3>
                    <span className="rounded-full border border-[#30363d] px-2 py-0.5 text-xs text-[#8b949e]">
                      {repo.visibility ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-sm text-[#8b949e]">
                    {repo.description || "No description provided"}
                  </p>
                </div>
              ))}
            </div>
          </main>

          <aside className="rounded-lg border border-[#30363d] bg-[#161b22] p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8b949e]">
              Followed Users
            </h3>
            {followedUsersList.length === 0 ? (
              <p className="mb-4 text-sm text-[#8b949e]">No followed users.</p>
            ) : (
              <ul className="mb-4 space-y-3">
                {followedUsersList.map((u) => (
                  <li
                    key={u._id}
                    onClick={() => navigate(`/profile/${u._id}`)}
                    className="flex items-center justify-between rounded-md border border-[#30363d] bg-[#0d1117] p-3 cursor-pointer transition hover:border-[#1f6feb]"
                  >
                    <div className="truncate text-sm">
                      <div className="font-medium text-[#c9d1d9] truncate">
                        {u.username}
                      </div>
                      <div className="text-xs text-[#8b949e] truncate">
                        {u.email}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
