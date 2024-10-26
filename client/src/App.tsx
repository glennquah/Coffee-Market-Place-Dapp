// src/App.tsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import Marketplace from './pages/MarketPlace';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-24">
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
