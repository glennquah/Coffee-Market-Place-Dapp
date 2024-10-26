// src/App.tsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import AuctionPage from './pages/AuctionPage';
import HomePage from './pages/HomePage';
import LeaderBoardPage from './pages/LeaderboardPage';
import MarketPlacePage from './pages/MarketPlacePage';
import VotingPage from './pages/VotingPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketPlacePage />} />
          <Route path="/auction" element={<AuctionPage />} />
          <Route path="/voting" element={<VotingPage />} />
          <Route path="/leaderboard" element={<LeaderBoardPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
