import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderBoardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TypingGamePage from "./pages/TypingGamePage";
import UserProfile from "./pages/UserProfile";
import { ThemeProvider } from "./provider/themeProvider";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Toaster />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/type" element={<TypingGamePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
