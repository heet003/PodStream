import React, { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import UsersList from "./UserList";
import { useAuth } from "../hooks/auth-hook";
import PodcastsList from "./PodcastList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AdminsList from "./AdminList";
import "./Admin.css";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const Admin = () => {
  const { token, role } = useAuth();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/admins/stats",
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setStats(responseData);
      } catch (err) {}
    };
    if (token && role === "admin") {
      fetchStats();
    }
  }, [sendRequest, token, role]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersList />;
      case "podcasts":
        return <PodcastsList />;
      case "admins":
        return <AdminsList />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <div className="admin-panel">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <Link to={`/add-user`} className="add-icon">
            <FontAwesomeIcon icon={faPlus} style={{ color: "#fff" }} />
            Users
          </Link>
        </div>
        <div className="stats">
          <button onClick={() => setActiveTab("users")}>
            <h3>
              <CountUp start={0} end={stats.userCount || 0} duration={2} />
            </h3>
            Users
          </button>
          <button onClick={() => setActiveTab("podcasts")}>
            <h3>
              <CountUp start={0} end={stats.podcastCount || 0} duration={2} />
            </h3>
            Podcasts
          </button>
          <button onClick={() => setActiveTab("admins")}>
            <h3>
              <CountUp start={0} end={stats.adminCount || 0} duration={2} />
            </h3>
            Admins
          </button>
        </div>
        {renderTabContent()}
      </div>
    </React.Fragment>
  );
};

export default Admin;
