import { Clock, Play, Target, Trophy } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const navigateToGame = () => navigate("/type");
  const navigateToLeaderboard = () => navigate("/leaderboard");

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--background)",
        color: "var(--text)",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Enhanced Theme Selector - Floating Bubble */}

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1
            className="text-6xl font-bold mb-6"
            style={{ color: "var(--heading, var(--text))" }}
          >
            Enhance Your{" "}
            <span style={{ color: "var(--primary)" }}>Typing Speed</span>
          </h1>
          <p
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary, var(--text))" }}
          >
            Challenge yourself in real-time typing competitions.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={navigateToGame}
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:opacity-90 flex items-center gap-2"
              style={{
                background: "var(--primary)",
                color: "white",
              }}
            >
              <Play className="h-5 w-5" />
              Start Typing Game
            </button>
            <button
              onClick={navigateToLeaderboard}
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:opacity-90 flex items-center gap-2"
              style={{
                background: "var(--secondary)",
                color: "white",
              }}
            >
              <Trophy className="h-5 w-5" />
              View Leaderboard
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: (
                <Clock
                  className="h-8 w-8"
                  style={{ color: "var(--primary)" }}
                />
              ),
              title: "Real-Time Racing",
              content: "Compete with players worldwide in live typing races.",
            },
            {
              icon: (
                <Trophy
                  className="h-8 w-8"
                  style={{ color: "var(--secondary)" }}
                />
              ),
              title: "Global Leaderboard",
              content: "Track your progress against the best typists.",
            },
            {
              icon: (
                <Target
                  className="h-8 w-8"
                  style={{ color: "var(--accent)" }}
                />
              ),
              title: "Skill Improvement",
              content: "Detailed statistics to help you improve.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: "var(--card-background, var(--background))",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="rounded-full w-16 h-16 flex items-center justify-center mb-6"
                style={{
                  background: "var(--icon-bg)",
                }}
              >
                {feature.icon}
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--heading, var(--text))" }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "var(--text-secondary, var(--text))" }}>
                {feature.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
