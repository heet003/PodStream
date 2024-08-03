import React, { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { Spin, Modal, Button, Tabs, Typography, Card } from "antd";
import { useAuth } from "../hooks/auth-hook";
import UsersList from "./UserList";
import PodcastsList from "./PodcastList";
import AdminsList from "./AdminList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import "./Admin.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const Admin = () => {
  const { token, role } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState("users");

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

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

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
      {isLoading && (
        <Modal visible={true} footer={null} closable={false}>
          <Spin size="large" />
        </Modal>
      )}
      {error && (
        <Modal
          title="An Error Occurred!"
          visible={true}
          onCancel={clearError}
          footer={<Button onClick={clearError}>Okay</Button>}
        >
          <p>{error}</p>
        </Modal>
      )}
      <div className="admin-panel">
        <div className="admin-header">
          <Title level={1} style={{ color: "white" }}>
            Admin Panel
          </Title>
          <Link to={`/add-user`} className="add-icon">
            <FontAwesomeIcon icon={faPlus} style={{ color: "#000" }} />
            Users
          </Link>
        </div>
        <div className="stats">
          <Card className="stat-card">
            <Title level={3} style={{ color: "white" }}>
              <CountUp start={0} end={stats.userCount || 0} duration={2} />
            </Title>
            Users
          </Card>
          <Card className="stat-card">
            <Title level={3} style={{ color: "white" }}>
              <CountUp start={0} end={stats.podcastCount || 0} duration={2} />
            </Title>
            Podcasts
          </Card>
          <Card className="stat-card">
            <Title level={3} style={{ color: "white" }}>
              <CountUp start={0} end={stats.adminCount || 0} duration={2} />
            </Title>
            Admins
          </Card>
        </div>
        <Tabs
          defaultActiveKey="users"
          onChange={handleTabChange}
          style={{ color: "white" }}
          activeKey={activeTab}
        >
          <TabPane tab="Users" key="users">
            {renderTabContent()}
          </TabPane>
          <TabPane tab="Podcasts" key="podcasts">
            {renderTabContent()}
          </TabPane>
          <TabPane tab="Admins" key="admins">
            {renderTabContent()}
          </TabPane>
        </Tabs>
      </div>
    </React.Fragment>
  );
};

export default Admin;
