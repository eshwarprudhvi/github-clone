import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import EditProfileModal from "./EditProfileModal";
import API_BASE_URL from "../../config";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: urlUserId } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [starredRepositories, setStarredRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const activeSection = useMemo(
    () => (location.pathname.endsWith("/starred") ? "starred" : "overview"),
    [location.pathname]
  );

  // Determine which user to fetch (from URL or current user)
  const profileUserId = urlUserId || currentUserId;

  const isOwnProfile = useMemo(() => {
    if (!profileUserId || !currentUserId) return true;
    return String(profileUserId) === String(currentUserId);
  }, [profileUserId, currentUserId]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        if (!profileUserId) {
          setProfile(null);
          setRepositories([]);
          setStarredRepositories([]);
          return;
        }

        const [profileRes, reposRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/user/profile/${profileUserId}`),
          axios.get(`${API_BASE_URL}/repo/user/${profileUserId}`),
        ]);

        setProfile(profileRes.data || null);

        const repoList = reposRes.data?.repos || [];
        setRepositories(repoList);

        const starred = (profileRes.data?.starRepositories || []).filter(
          (repo) => repo && typeof repo === "object"
        );
        setStarredRepositories(starred);

        // Check if current user is following this profile
        if (!isOwnProfile && currentUserId) {
          const currentUserRes = await axios.get(
            `${API_BASE_URL}/user/profile/${currentUserId}`
          );
          const isAlreadyFollowing = (
            currentUserRes.data?.followedUsers || []
          ).some((id) => String(id) === String(profileUserId));
          setIsFollowing(isAlreadyFollowing);
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
        setProfile(null);
        setRepositories([]);
        setStarredRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileUserId, currentUserId, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !profileUserId) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await axios.post(
          `${API_BASE_URL}/user/unfollow/${currentUserId}/${profileUserId}`
        );
        setIsFollowing(false);
      } else {
        await axios.post(
          `${API_BASE_URL}/user/follow/${currentUserId}/${profileUserId}`
        );
        setIsFollowing(true);
      }
      
      handleProfileUpdated();
    } catch (error) {
      console.error("Failed to follow/unfollow", error);
      alert(error.response?.data?.message || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleProfileUpdated = async () => {
    // Refresh profile data after update
    try {
      const res = await axios.get(
        `${API_BASE_URL}/user/profile/${profileUserId}`
      );
      setProfile(res.data || null);
    } catch (error) {
      console.error("Failed to refresh profile", error);
    }
  };

  const tabClass = ({ isActive }) =>
    `inline-flex border-b-2 px-3 py-3 text-sm font-medium ${
      isActive
        ? "border-[#f78166] text-white"
        : "border-transparent text-[#8b949e] hover:text-[#c9d1d9]"
    }`;

  const renderOverview = () => {
    if (repositories.length === 0) {
      return (
        <div className="rounded-md border border-dashed border-[#30363d] bg-[#0d1117] p-6 text-center text-sm text-[#8b949e]">
          No repositories yet.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {repositories.map((repo) => (
          <div
            key={repo._id}
            onClick={() => navigate(`/repo/${repo._id}`)}
            className="rounded-md border border-[#30363d] bg-[#0d1117] p-4 cursor-pointer transition hover:border-[#1f6feb]"
          >
            <div className="mb-1 flex items-center justify-between gap-3">
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
    );
  };

  const renderStarred = () => {
    if (starredRepositories.length === 0) {
      return (
        <div className="rounded-md border border-dashed border-[#30363d] bg-[#0d1117] p-6 text-center text-sm text-[#8b949e]">
          You have not starred any repositories yet.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {starredRepositories.map((repo) => (
          <div
            key={repo._id}
            onClick={() => navigate(`/repo/${repo._id}`)}
            className="rounded-md border border-[#30363d] bg-[#0d1117] p-4 cursor-pointer transition hover:border-[#1f6feb]"
          >
            <h3 className="truncate text-base font-semibold text-[#58a6ff]">
              {repo.name}
            </h3>
            <p className="mt-1 text-sm text-[#8b949e]">
              {repo.description || "No description provided"}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <Navbar />
      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 border-b border-[#30363d]">
          <NavLink to={urlUserId ? `/profile/${urlUserId}` : "/profile"} end className={tabClass}>
            Overview
          </NavLink>
          <NavLink to={urlUserId ? `/profile/${urlUserId}/starred` : "/profile/starred"} className={tabClass}>
            Starred Repositories
          </NavLink>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
            <div className="mx-auto mb-4 h-28 w-28 rounded-full border border-[#30363d] bg-[#8b949e]" />
            <h2 className="text-center text-2xl font-semibold text-white">
              {profile?.username || "Username"}
            </h2>
            <p className="mt-1 text-center text-sm text-[#8b949e]">
              {profile?.email || "email@example.com"}
            </p>
            {!isOwnProfile && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`mt-5 w-full rounded-md border px-4 py-2 text-sm font-medium transition ${
                  isFollowing
                    ? "border-[#1f6feb] bg-[#0d1117] text-[#1f6feb] hover:bg-[#1f6feb]/10"
                    : "border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:border-[#8b949e] hover:bg-[#30363d]"
                } disabled:opacity-50`}
              >
                {followLoading
                  ? "Loading..."
                  : isFollowing
                  ? "Following"
                  : "Follow"}
              </button>
            )}
            {isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-5 w-full rounded-md border border-[#1f6feb] bg-[#0d1117] px-4 py-2 text-sm font-medium text-[#1f6feb] transition hover:bg-[#1f6feb]/10"
              >
                Edit Profile
              </button>
            )}
            <p className="mt-5 text-center text-sm text-[#8b949e]">
              <span className="font-semibold text-[#c9d1d9]">
                {profile?.followersCount || 0}
              </span>{" "}
              Followers
              <span className="mx-2">.</span>
              <span className="font-semibold text-[#c9d1d9]">
                {profile?.followedUsers?.length || 0}
              </span>{" "}
              Following
            </p>
          </aside>

          <main className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
            {loading ? (
              <p className="text-sm text-[#8b949e]">Loading profile...</p>
            ) : activeSection === "starred" ? (
              renderStarred()
            ) : (
              renderOverview()
            )}
          </main>
        </div>
      </section>

      <EditProfileModal
        user={profile}
        userId={currentUserId}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleProfileUpdated}
      />
    </div>
  );
};

export default Profile;
