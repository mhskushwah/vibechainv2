import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import MyTeam from "./components/MyTeam";
import CommunityTree from "./components/CommunityTree";
import CommunityInfo from "./components/CommunityInfo";
import RecentIncome from './components/RecentIncome';
import Navbar from './components/Navbar';
import './components/Navbar.css';  // Agar aap chahein toh styling yahan rakh sakte hain
import Logout from './components/Logout';






function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myteam" element={<MyTeam userId={1} />} />
        <Route path="/communitytree" element={<CommunityTree />} />
        <Route path="/communityinfo" element={<CommunityInfo />} />
        <Route path="/recentincome" element={<RecentIncome />} />
        <Route path="/logout" element={<Logout />} />

        

      </Routes>
    </Router>
  );
}

export default App;