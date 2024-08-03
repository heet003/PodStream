import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

import Auth from "./components/Auth/Auth";
import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/NavBar/NavBar";
import DashBoard from "./components/DashBoard/DashBoard";
import { AuthContext } from "./components/context/auth-context";
import { useAuth } from "./components/hooks/auth-hook";
import Otp from "./components/Auth/Otp";
import Content from "./components/Content/Content";
import SearchPodcast from "./components/Search/SearchPodcast";
import Favourites from "./components/Favourites/Favourites";
import PodcastDetails from "./components/Shared/UIElements/PodcastDetails";
import UserProfile from "./components/UserProfile/UserProfile";
import UploadPodcast from "./components/UploadPodcast/UploadPodcast";
import UserPodcasts from "./components/UserPodcasts/UserPodcasts";
import Admin from "./components/Admin/Admin";

const App = () => {
  const { token, login, logout, role } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  let routes;

  if (token) {
    if (role === "user") {
      routes = (
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/podcast/:id" element={<PodcastDetails />} />
          <Route path="/search" element={<SearchPodcast />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    } else if (role === "admin") {
      routes = (
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/upload" element={<UploadPodcast />} />
          <Route path="/podcast/:id" element={<PodcastDetails />} />
          <Route path="/search" element={<SearchPodcast />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/pod-library" element={<UserPodcasts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    } else {
      routes = (
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/upload" element={<UploadPodcast />} />
          <Route path="/pod-library" element={<UserPodcasts />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/podcast/:id" element={<PodcastDetails />} />
          <Route path="/search" element={<SearchPodcast />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    }
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-otp" element={<Otp />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        role: role,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <Content isOpen={isSidebarOpen}>
          <NavBar onClick={toggleSidebar} />
          <main>{routes}</main>
        </Content>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
