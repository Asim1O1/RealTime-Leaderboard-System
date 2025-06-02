import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderBoardPage";
import TypingGamePage from "./pages/TypingGamePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/type" element={<TypingGamePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
