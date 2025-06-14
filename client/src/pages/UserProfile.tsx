import {
  Calendar,
  Camera,
  Check,
  Edit3,
  Gamepad2,
  Mail,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setPreviewImage(user.profileImage || null);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    if (imageInputRef.current?.files?.[0]) {
      formData.append("profileImage", imageInputRef.current.files[0]);
    }
    await updateUserProfile(formData);
    setIsEditing(false);
  };

  const getScoreColor = (score) => {
    if (score >= 3000) return "text-emerald-600 bg-emerald-50";
    if (score >= 2000) return "text-blue-600 bg-blue-50";
    return "text-purple-600 bg-purple-50";
  };

  const getBadgeColor = (score) => {
    if (score >= 3000) return "from-emerald-400 to-emerald-600";
    if (score >= 2000) return "from-blue-400 to-blue-600";
    return "from-purple-400 to-purple-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Player Profile
          </h1>
          <p className="text-gray-600">
            Manage your gaming profile and track your progress
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <X className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!loading && user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24 relative">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                        <img
                          src={
                            previewImage ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                          }
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-16 pb-6 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-xl font-bold text-center border-b-2 border-indigo-300 focus:border-indigo-600 outline-none bg-transparent"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-gray-800">
                        {username}
                      </h2>
                    )}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-1 text-gray-600 mb-4">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Gamepad2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Games
                        </span>
                      </div>
                      <p className="text-xl font-bold text-blue-600">
                        {user.gamesPlayed}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">
                          Joined
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-purple-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(user.username);
                        }}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats and Scores */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-800">
                    Performance Overview
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {user.scores?.length > 0
                          ? Math.max(...user.scores.map((s) => s.value))
                          : 0}
                      </p>
                      <p className="text-sm font-medium text-yellow-800">
                        Best Score
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {user.scores?.length > 0
                          ? Math.round(
                              user.scores.reduce((a, b) => a + b.value, 0) /
                                user.scores.length
                            )
                          : 0}
                      </p>
                      <p className="text-sm font-medium text-green-800">
                        Average
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {user.scores?.length || 0}
                      </p>
                      <p className="text-sm font-medium text-blue-800">
                        Total Scores
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Scores */}
              {user.scores?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-indigo-500" />
                    <span>Recent Achievements</span>
                  </h3>

                  <div className="space-y-3">
                    {user.scores.slice(0, 5).map((score, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${getBadgeColor(
                              score.value
                            )} flex items-center justify-center text-white font-bold shadow-lg`}
                          >
                            #{index + 1}
                          </div>
                          <div>
                            <p
                              className={`text-lg font-bold ${
                                getScoreColor(score.value).split(" ")[0]
                              }`}
                            >
                              {score.value.toLocaleString()} pts
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(score.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(
                            score.value
                          )}`}
                        >
                          {score.value >= 3000
                            ? "Excellent"
                            : score.value >= 2000
                            ? "Good"
                            : "Fair"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Update Profile Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
