import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import API_BASE_URL from "../../config";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followingLoading, setFollowingLoading] = useState({});
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_BASE_URL}/user/allUsers`);
        setUsers(res.data || []);
        setFilteredUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Unable to load users.");
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        if (!currentUserId) return;
        const res = await axios.get(
          `${API_BASE_URL}/user/profile/${currentUserId}`
        );
        setFollowedUsers(res.data?.followedUsers || []);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setFollowedUsers([]);
      }
    };

    fetchAllUsers();
    fetchProfile();
  }, [currentUserId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, users]);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const isFollowing = (userId) => {
    return followedUsers.some((id) => String(id) === String(userId));
  };

  const handleFollowToggle = async (e, userId) => {
    e.stopPropagation();
    if (!currentUserId) {
      alert("Please login first");
      return;
    }

    setFollowingLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      if (isFollowing(userId)) {
        // Unfollow
        await axios.post(
          `${API_BASE_URL}/user/unfollow/${currentUserId}/${userId}`
        );
        setFollowedUsers((prev) =>
          prev.filter((id) => String(id) !== String(userId))
        );
      } else {
        // Follow
        await axios.post(
          `${API_BASE_URL}/user/follow/${currentUserId}/${userId}`
        );
        setFollowedUsers((prev) => [...prev, userId]);
      }
    } catch (err) {
      console.error("Failed to follow/unfollow user", err);
      alert(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setFollowingLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-[calc(100vh-72px)] bg-[#0d1117] px-4 py-6 text-[#c9d1d9] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 border-b border-[#30363d] pb-4">
            <h2 className="mb-2 text-2xl font-semibold text-white">
              All Users
            </h2>
            <p className="text-sm text-[#8b949e]">
              Browse and connect with all users in the community.
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-3 text-[#c9d1d9] placeholder:text-[#8b949e] focus:border-[#1f6feb] focus:outline-none focus:ring-2 focus:ring-[#1f6feb]/40"
            />
          </div>

          {loading && (
            <p className="text-center text-[#8b949e]">Loading users...</p>
          )}

          {error && (
            <p className="rounded-md border border-[#f85149]/40 bg-[#f85149]/10 px-4 py-3 text-sm text-[#ff7b72]">
              {error}
            </p>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <div className="rounded-md border border-dashed border-[#30363d] bg-[#0d1117] p-8 text-center">
              <p className="text-[#8b949e]">
                {searchQuery.trim()
                  ? "No users match your search."
                  : "No users found."}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="cursor-pointer rounded-lg border border-[#30363d] bg-[#161b22] p-4 transition hover:border-[#1f6feb] hover:shadow-lg"
              >
                <div
                  onClick={() => handleUserClick(user._id)}
                  className="mb-3 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="truncate text-base font-semibold text-[#58a6ff]">
                      {user.username}
                    </h3>
                    <p className="mt-1 truncate text-sm text-[#8b949e]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleUserClick(user._id)}
                  className="space-y-2 border-t border-[#30363d] pt-3"
                >
                  <div className="flex justify-between text-xs text-[#8b949e]">
                    <span>
                      Repositories: {(user.repositories || []).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#8b949e]">
                    <span>Following: {(user.followedUsers || []).length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#8b949e]">
                    <span>Starred: {(user.starRepositories || []).length}</span>
                  </div>
                </div>

                {String(user._id) !== String(currentUserId) ? (
                  <button
                    onClick={(e) => handleFollowToggle(e, user._id)}
                    disabled={followingLoading[user._id]}
                    className={`mt-3 w-full rounded-md border py-2 text-sm font-medium transition ${
                      isFollowing(user._id)
                        ? "border-[#1f6feb] bg-[#0d1117] text-[#1f6feb] hover:bg-[#1f6feb]/10"
                        : "border-[#30363d] bg-[#0d1117] text-[#58a6ff] hover:border-[#1f6feb]"
                    } disabled:opacity-50`}
                  >
                    {followingLoading[user._id]
                      ? "Loading..."
                      : isFollowing(user._id)
                      ? "Following"
                      : "Follow"}
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(user._id);
                    }}
                    className="mt-3 w-full rounded-md border border-[#30363d] bg-[#0d1117] py-2 text-sm font-medium text-[#58a6ff] transition hover:bg-[#0d1117]/80"
                  >
                    View Profile
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllUsers;
