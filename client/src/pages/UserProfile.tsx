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
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              background: `linear-gradient(to right, var(--primary), var(--secondary))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Player Profile
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your gaming profile and track your progress
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 rounded-xl p-4 flex items-center justify-between"
            style={{
              background: "var(--error-bg)",
              border: "1px solid var(--error-border)",
            }}
          >
            <X style={{ color: "var(--error-text)" }} className="w-5 h-5" />
            <span style={{ color: "var(--error-text)", fontWeight: 500 }}>
              {error}
            </span>
          </div>
        )}

        {!loading && user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  background: "var(--card-background)",
                  borderColor: "var(--card-border)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <div
                  className="h-24 relative"
                  style={{
                    background: `linear-gradient(to right, var(--primary), var(--secondary))`,
                  }}
                >
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative group">
                      <div
                        className="w-24 h-24 rounded-full p-1"
                        style={{
                          background: "var(--card-background)",
                          boxShadow: "var(--shadow-lg)",
                        }}
                      >
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
                        className="absolute bottom-0 right-0 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
                        style={{
                          background: "var(--primary-button-bg)",
                          boxShadow: "var(--shadow-lg)",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.background =
                            "var(--primary-button-hover)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background =
                            "var(--primary-button-bg)")
                        }
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
                        className="text-xl font-bold text-center border-b-2 outline-none bg-transparent"
                        style={{
                          color: "var(--heading)",
                          borderColor: "var(--primary)",
                          background: "transparent",
                        }}
                      />
                    ) : (
                      <h2
                        className="text-xl font-bold"
                        style={{ color: "var(--heading)" }}
                      >
                        {username}
                      </h2>
                    )}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="transition-colors"
                      style={{ color: "var(--primary)" }}
                      onMouseOver={(e) =>
                        (e.target.style.color = "var(--secondary)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.color = "var(--primary)")
                      }
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-1 mb-4">
                    <Mail
                      className="w-4 h-4"
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>
                      {user.email}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="rounded-xl p-3 border"
                      style={{
                        background: "var(--card-background)",
                        borderColor: "var(--card-border)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Gamepad2
                          className="w-4 h-4"
                          style={{ color: "var(--primary)" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Games
                        </span>
                      </div>
                      <p
                        className="text-xl font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {user.gamesPlayed}
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-3 border"
                      style={{
                        background: "var(--card-background)",
                        borderColor: "var(--card-border)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: "var(--secondary)" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Joined
                        </span>
                      </div>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "var(--secondary)" }}
                      >
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
                        className="flex-1 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                        style={{
                          background: "var(--success-border)",
                          color: "var(--primary-button-text)",
                        }}
                        onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                        onMouseOut={(e) => (e.target.style.opacity = "1")}
                      >
                        <Check className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(user.username);
                        }}
                        className="flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        style={{
                          background: "var(--button-bg)",
                          color: "var(--button-text)",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.background = "var(--button-hover)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.background = "var(--button-bg)")
                        }
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
              <div
                className="rounded-xl p-6 border"
                style={{
                  background: "var(--card-background)",
                  borderColor: "var(--card-border)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--heading)" }}
                  >
                    Performance Overview
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      background: "var(--card-background)",
                      borderColor: "var(--warning-border)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div className="text-center">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--accent)" }}
                      >
                        {user.scores?.length > 0
                          ? Math.max(...user.scores.map((s) => s.value))
                          : 0}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Best Score
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      background: "var(--card-background)",
                      borderColor: "var(--success-border)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div className="text-center">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--success-text)" }}
                      >
                        {user.scores?.length > 0
                          ? Math.round(
                              user.scores.reduce((a, b) => a + b.value, 0) /
                                user.scores.length
                            )
                          : 0}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Average
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      background: "var(--card-background)",
                      borderColor: "var(--card-border)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div className="text-center">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {user.scores?.length || 0}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Total Scores
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Scores */}
              {user.scores?.length > 0 && (
                <div
                  className="rounded-2xl border p-6"
                  style={{
                    background: "var(--card-background)",
                    borderColor: "var(--card-border)",
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-4 flex items-center space-x-2"
                    style={{ color: "var(--heading)" }}
                  >
                    <Trophy
                      className="w-5 h-5"
                      style={{ color: "var(--primary)" }}
                    />
                    <span>Recent Achievements</span>
                  </h3>

                  <div className="space-y-3">
                    {user.scores.slice(0, 5).map((score, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02]"
                        style={{
                          background: "var(--card-background)",
                          borderColor: "var(--card-border)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.boxShadow = "var(--shadow-md)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                            style={{
                              background: `linear-gradient(to bottom right, var(--primary), var(--secondary))`,
                              boxShadow: "var(--shadow-md)",
                            }}
                          >
                            #{index + 1}
                          </div>
                          <div>
                            <p
                              className="text-lg font-bold"
                              style={{ color: "var(--primary)" }}
                            >
                              {score.value.toLocaleString()} pts
                            </p>
                            <p
                              style={{ color: "var(--text-tertiary)" }}
                              className="text-sm"
                            >
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
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background:
                              score.value >= 3000
                                ? "var(--success-bg)"
                                : score.value >= 2000
                                ? "var(--warning-bg)"
                                : "var(--card-background)",
                            color:
                              score.value >= 3000
                                ? "var(--success-text)"
                                : score.value >= 2000
                                ? "var(--warning-text)"
                                : "var(--text-secondary)",
                            border: `1px solid ${
                              score.value >= 3000
                                ? "var(--success-border)"
                                : score.value >= 2000
                                ? "var(--warning-border)"
                                : "var(--card-border)"
                            }`,
                          }}
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
                  className="w-full py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                  style={{
                    background: `linear-gradient(to right, var(--primary), var(--secondary))`,
                    color: "var(--primary-button-text)",
                    boxShadow: "var(--shadow-lg)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.boxShadow = "var(--shadow-lg)";
                    e.target.style.opacity = "0.9";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.boxShadow = "var(--shadow-lg)";
                    e.target.style.opacity = "1";
                  }}
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
