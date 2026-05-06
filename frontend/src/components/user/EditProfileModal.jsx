import axios from "axios";
import React, { useState } from "react";
import API_BASE_URL from "../../config";

const EditProfileModal = ({ user, userId, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username) {
      setError("Username is required");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        username: formData.username,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await axios.put(
        `${API_BASE_URL}/user/update/${userId}`,
        updateData
      );

      setFormData({
        username: res.data.result.username,
        password: "",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/user/delete/${userId}`);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-[#30363d] bg-[#0d1117] p-6 text-[#c9d1d9]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-[#c9d1d9]"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-[#f85149]/40 bg-[#f85149]/10 px-4 py-3 text-sm text-[#ff7b72]">
            {error}
          </div>
        )}

        {!showDeleteConfirm ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#c9d1d9]">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-[#c9d1d9] placeholder:text-[#8b949e] focus:border-[#1f6feb] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#c9d1d9]">
                New Password (Optional)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full rounded-md border border-[#30363d] bg-[#161b22] px-4 py-2 text-[#c9d1d9] placeholder:text-[#8b949e] focus:border-[#1f6feb] focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-md bg-[#1f6feb] py-2 font-medium text-white transition hover:bg-[#388bfd] disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-[#30363d] bg-[#161b22] py-2 font-medium text-[#c9d1d9] transition hover:bg-[#21262d]"
              >
                Cancel
              </button>
            </div>

            <div className="border-t border-[#30363d] pt-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full rounded-md border border-[#f85149] bg-[#f85149]/10 py-2 font-medium text-[#ff7b72] transition hover:bg-[#f85149]/20"
              >
                Delete Account
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#8b949e]">
              Are you sure you want to delete your account? This action cannot
              be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 rounded-md border border-[#f85149] bg-[#f85149] py-2 font-medium text-white transition hover:bg-[#da3633] disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-md border border-[#30363d] bg-[#161b22] py-2 font-medium text-[#c9d1d9] transition hover:bg-[#21262d]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfileModal;
