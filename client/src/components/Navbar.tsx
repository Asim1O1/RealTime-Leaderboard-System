import {
  Clock,
  Home,
  LogIn,
  Menu,
  Trophy,
  User,
  UserPlus,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={navigateToHome}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TypeMaster
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={navigateToHome}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <Home className="h-4 w-4" />
              Home
            </button>

            <button
              onClick={navigateToGame}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
            >
              <Clock className="h-4 w-4" />
              Play Game
            </button>

            <button
              onClick={navigateToLeaderboard}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={navigateToProfile}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={navigateToLogin}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
                <button
                  onClick={navigateToRegister}
                  className="flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={navigateToHome}
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
              >
                <Home className="h-5 w-5" />
                Home
              </button>

              <button
                onClick={navigateToGame}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium w-full justify-start"
              >
                <Clock className="h-5 w-5" />
                Play Game
              </button>

              <button
                onClick={navigateToLeaderboard}
                className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium py-2"
              >
                <Trophy className="h-5 w-5" />
                Leaderboard
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={navigateToProfile}
                    className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium py-2"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={navigateToLogin}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </button>
                  <button
                    onClick={navigateToRegister}
                    className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium w-full justify-start"
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
