import React from "react";
import "./NavBar.css";
import { MenuOutlined } from "@ant-design/icons";
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
    <nav className="navbar">
      <div className="menu-button">
        <button onClick={props.onClick}>
          <MenuOutlined />
        </button>
      </div>
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
    </nav>
  );
}

export default NavBar;
