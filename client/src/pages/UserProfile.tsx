import React, { useEffect, useRef, useState } from "react";
import useUserStore from "../stores/user.store";

const UserProfile = () => {
  const {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    clearError,
  } = useUserStore();

  const [username, setUsername] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setPreviewImage(user.profileImage || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    if (imageInputRef.current?.files?.[0]) {
      formData.append("profileImage", imageInputRef.current.files[0]);
    }
    await updateUserProfile(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">User Profile</h1>

      {loading && <p className="text-center text-blue-600">Loading...</p>}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
          <button onClick={clearError} className="ml-4 text-sm underline">
            Dismiss
          </button>
        </div>
      )}

      {!loading && user && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <img
              src={previewImage || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border mb-2"
            />
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="text"
                value={user.email}
                readOnly
                className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Games Played
              </label>
              <input
                type="number"
                value={user.gamesPlayed}
                readOnly
                className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Joined At
              </label>
              <input
                type="text"
                value={new Date(user.createdAt).toLocaleDateString()}
                readOnly
                className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md"
              />
            </div>
          </div>

          {user.scores?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-6 mb-2">Recent Scores</h3>
              <ul className="space-y-1">
                {user.scores.slice(0, 5).map((score: any, index: number) => (
                  <li
                    key={index}
                    className="bg-gray-50 p-2 rounded border text-sm"
                  >
                    {score.value} -{" "}
                    <span className="text-gray-500 text-xs">
                      {new Date(score.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
