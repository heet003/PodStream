import React from "react";
import "./NavBar.css";
import { MenuOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { createFromIconfontCN } from "@ant-design/icons";
import { useAuth } from "../hooks/auth-hook";
import { Space } from "antd";
import { Link } from "react-router-dom";
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
});

function NavBar(props) {
  const { token, logout } = useAuth();

  return (
    <React.Fragment>
      <nav className="navbar">
        <div className="menu-button">
          <button onClick={props.onClick}>
            <MenuOutlined />
          </button>
        </div>
        <div className="sub-navbar">
          {token ? (
            <div className="user-profile-navbar">
              <Link to={`/profile`}>
                <FontAwesomeIcon
                  icon={faCircleUser}
                  size="xl"
                  style={{ color: "#fff" }}
                />
              </Link>
            </div>
          ) : (
            <div className="user-profile-button">
              <Link to={`/auth`} className="w3-button">
                <FontAwesomeIcon
                  icon={faUserLock}
                  size="xl"
                  style={{ color: "#fff" }}
                />
              </Link>
            </div>
          )}
          {token ? (
            <div className="logout-button-navbar">
              <Link to={`/`} onClick={logout}>
                <Space>
                  <IconFont type="icon-tuichu" />
                </Space>
                Logout
              </Link>
            </div>
          ) : (
            <div className="login-button">
              <Link to={`/auth`} className="w3-button">
                <Space>
                  <IconFont type="icon-tuichu" />
                </Space>
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </React.Fragment>
  );
}

export default NavBar;
