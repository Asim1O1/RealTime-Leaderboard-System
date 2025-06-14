import { Clock, Play, Target, Trophy } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const navigateToGame = () => {
    navigate("/type");
  };

  const navigateToLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Enhance Your <span className="text-blue-600">Typing Speed</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Challenge yourself in real-time typing competitions. Improve your
            WPM, climb the leaderboard, and become the ultimate typing champion!
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={navigateToGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Play className="h-5 w-5" />
              Start Typing Game
            </button>
            <button
              onClick={navigateToLeaderboard}
              className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-200 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Trophy className="h-5 w-5" />
              View Leaderboard
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Real-Time Racing
            </h3>
            <p className="text-gray-600">
              Compete with players worldwide in live typing races. See your WPM
              and accuracy update in real-time.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Global Leaderboard
            </h3>
            <p className="text-gray-600">
              Track your progress and see how you rank against the best typists
              from around the world.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Skill Improvement
            </h3>
            <p className="text-gray-600">
              Detailed statistics and performance analytics help you identify
              areas for improvement.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl p-8 mt-16 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Game Statistics
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Players</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Games Played</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">150</div>
              <div className="text-gray-600">Average WPM</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Average Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
