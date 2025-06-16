import {
  Clock,
  Droplet,
  Home,
  LogIn,
  Menu,
  Moon,
  Sun,
  Sunset,
  Trees,
  Trophy,
  User,
  UserPlus,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { useThemeStore } from "../stores/theme.store";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme, themes } = useThemeStore();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeConfig = {
    light: {
      icon: <Sun className="h-4 w-4" />,
      label: "Light",
      color: "#f59e0b",
      gradient: "from-yellow-400 to-orange-500",
    },
    dark: {
      icon: <Moon className="h-4 w-4" />,
      label: "Dark",
      color: "#6366f1",
      gradient: "from-indigo-500 to-purple-600",
    },
    ocean: {
      icon: <Droplet className="h-4 w-4" />,
      label: "Ocean",
      color: "#06b6d4",
      gradient: "from-cyan-400 to-blue-500",
    },
    forest: {
      icon: <Trees className="h-4 w-4" />,
      label: "Forest",
      color: "#10b981",
      gradient: "from-emerald-400 to-green-600",
    },
    sunset: {
      icon: <Sunset className="h-4 w-4" />,
      label: "Sunset",
      color: "#f97316",
      gradient: "from-orange-400 to-pink-500",
    },
  };
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const navigateToHome = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navigateToGame = () => {
    navigate("/type");
    setIsMobileMenuOpen(false);
  };

  const navigateToLeaderboard = () => {
    navigate("/leaderboard");
    setIsMobileMenuOpen(false);
  };

  const navigateToProfile = () => {
    navigate("/profile");
    setIsMobileMenuOpen(false);
  };

  const navigateToLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const navigateToRegister = () => {
    navigate("/register");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className="backdrop-blur-md border-b sticky top-0 z-50 shadow-sm"
      style={{
        background: "var(--nav-bg)",
        borderColor: "var(--nav-border)",
        boxShadow: "0 1px 2px 0 var(--nav-shadow)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={navigateToHome}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div
              className="rounded-lg p-2"
              style={{
                background: "var(--logo-bg)",
              }}
            >
              <Clock
                className="h-6 w-6"
                style={{ color: "var(--logo-icon)" }}
              />
            </div>
            <span
              className="text-xl font-bold bg-clip-text text-transparent"
              style={{ color: "var(--heading, var(--text))" }}
            >
              TypeIt
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={navigateToHome}
              className="flex items-center gap-2 transition-colors duration-200 font-medium"
              style={{
                color: "var(--nav-link)",
                "&:hover": {
                  color: "var(--nav-link-hover)",
                },
              }}
            >
              <Home className="h-4 w-4" />
              Home
            </button>

            <button
              onClick={navigateToGame}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
              style={{
                background: "var(--primary-button-bg)",
                color: "var(--primary-button-text)",
                "&:hover": {
                  background: "var(--primary-button-hover)",
                },
              }}
            >
              <Clock className="h-4 w-4" />
              Play Game
            </button>

            <button
              onClick={navigateToLeaderboard}
              className="flex items-center gap-2 transition-colors duration-200 font-medium"
              style={{
                color: "var(--nav-link)",
                "&:hover": {
                  color: "var(--nav-link-hover)",
                },
              }}
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={navigateToProfile}
                  className="flex items-center gap-2 transition-colors duration-200 font-medium"
                  style={{
                    color: "var(--nav-link)",
                    "&:hover": {
                      color: "var(--profile-link-hover)",
                    },
                  }}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="transition-colors duration-200 font-medium"
                  style={{
                    color: "var(--nav-link)",
                    "&:hover": {
                      color: "var(--logout-link-hover)",
                    },
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={navigateToLogin}
                  className="flex items-center gap-2 transition-colors duration-200 font-medium"
                  style={{
                    color: "var(--nav-link)",
                    "&:hover": {
                      color: "var(--nav-link-hover)",
                    },
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
                <button
                  onClick={navigateToRegister}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  style={{
                    background: "var(--secondary-button-bg)",
                    color: "var(--secondary-button-text)",
                    "&:hover": {
                      background: "var(--secondary-button-hover)",
                    },
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </button>
              </>
            )}
            {/* Enhanced Theme Selector - Floating Bubble */}
            <div className="fixed top-6 right-6 z-50">
              <div className="relative">
                {/* Main Theme Button */}
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${themeConfig[theme].color}20, ${themeConfig[theme].color}40)`,
                    border: `2px solid ${themeConfig[theme].color}60`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Animated background */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig[theme].color}30, ${themeConfig[theme].color}50)`,
                    }}
                  />

                  {/* Icon */}
                  <div className="relative z-10 text-white">
                    {themeConfig[theme].icon}
                  </div>

                  {/* Pulse effect */}
                  <div
                    className="absolute inset-0 rounded-full animate-pulse opacity-20"
                    style={{ background: themeConfig[theme].color }}
                  />
                </button>

                {/* Theme Options Menu */}
                {isThemeMenuOpen && (
                  <div className="absolute top-16 right-0 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-4 min-w-[200px] animate-in slide-in-from-top-2 duration-300">
                    <div className="text-sm font-medium text-gray-700 mb-3 px-2">
                      Choose Theme
                    </div>

                    <div className="space-y-2">
                      {themes.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTheme(t);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${
                            theme === t
                              ? "bg-gradient-to-r text-white shadow-md"
                              : "hover:bg-gray-100/80 text-gray-700"
                          }`}
                          style={{
                            background:
                              theme === t
                                ? `linear-gradient(135deg, ${themeConfig[t].color}, ${themeConfig[t].color}dd)`
                                : undefined,
                          }}
                        >
                          {/* Theme Icon */}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              theme === t ? "bg-white/20" : "bg-gray-100"
                            }`}
                          >
                            <div
                              className={
                                theme === t ? "text-white" : "text-gray-600"
                              }
                            >
                              {themeConfig[t].icon}
                            </div>
                          </div>

                          {/* Theme Label */}
                          <span className="font-medium">
                            {themeConfig[t].label}
                          </span>

                          {/* Active Indicator */}
                          {theme === t && (
                            <div className="ml-auto">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Decorative gradient border */}
                    <div
                      className="absolute inset-0 rounded-2xl p-[1px] -z-10"
                      style={{
                        background: `linear-gradient(135deg, ${themeConfig[theme].color}40, transparent, ${themeConfig[theme].color}20)`,
                      }}
                    >
                      <div className="w-full h-full rounded-2xl bg-white/90" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Click outside to close */}
            {isThemeMenuOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsThemeMenuOpen(false)}
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{
              "&:hover": {
                background: "var(--mobile-menu-button-hover)",
              },
            }}
          >
            {isMobileMenuOpen ? (
              <X
                className="h-6 w-6"
                style={{ color: "var(--mobile-menu-icon)" }}
              />
            ) : (
              <Menu
                className="h-6 w-6"
                style={{ color: "var(--mobile-menu-icon)" }}
              />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden py-4"
            style={{
              borderTop: "1px solid var(--mobile-menu-border)",
            }}
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={navigateToHome}
                className="flex items-center gap-3 py-2 transition-colors duration-200 font-medium"
                style={{
                  color: "var(--nav-link)",
                  "&:hover": {
                    color: "var(--nav-link-hover)",
                  },
                }}
              >
                <Home className="h-5 w-5" />
                Home
              </button>

              <button
                onClick={navigateToGame}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium w-full justify-start"
                style={{
                  background: "var(--primary-button-bg)",
                  color: "var(--primary-button-text)",
                  "&:hover": {
                    background: "var(--primary-button-hover)",
                  },
                }}
              >
                <Clock className="h-5 w-5" />
                Play Game
              </button>

              <button
                onClick={navigateToLeaderboard}
                className="flex items-center gap-3 py-2 transition-colors duration-200 font-medium"
                style={{
                  color: "var(--nav-link)",
                  "&:hover": {
                    color: "var(--nav-link-hover)",
                  },
                }}
              >
                <Trophy className="h-5 w-5" />
                Leaderboard
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={navigateToProfile}
                    className="flex items-center gap-3 py-2 transition-colors duration-200 font-medium"
                    style={{
                      color: "var(--nav-link)",
                      "&:hover": {
                        color: "var(--profile-link-hover)",
                      },
                    }}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 transition-colors duration-200 font-medium"
                    style={{
                      color: "var(--nav-link)",
                      "&:hover": {
                        color: "var(--logout-link-hover)",
                      },
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={navigateToLogin}
                    className="flex items-center gap-3 py-2 transition-colors duration-200 font-medium"
                    style={{
                      color: "var(--nav-link)",
                      "&:hover": {
                        color: "var(--nav-link-hover)",
                      },
                    }}
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </button>
                  <button
                    onClick={navigateToRegister}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium w-full justify-start"
                    style={{
                      background: "var(--secondary-button-bg)",
                      color: "var(--secondary-button-text)",
                      "&:hover": {
                        background: "var(--secondary-button-hover)",
                      },
                    }}
                  >
                    <UserPlus className="h-5 w-5" />
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
