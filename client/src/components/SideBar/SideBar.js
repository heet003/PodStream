import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../hooks/auth-hook";
import {
  faMicrophone,
  faArrowRightToBracket,
  faHeart,
  faCloudArrowUp,
  faMagnifyingGlass,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import "./SideBar.css";

function SideBar({ isOpen, onClose }) {
  const { token, logout, role } = useAuth();
  console.log(role);
  return (
    <React.Fragment>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div>
          <div className="logo-container">
            <FontAwesomeIcon
              className="logo-FontAwesomeIcon"
              icon={faMicrophone}
              style={{ color: "#ff8a8a", fontSize: "1.5rem" }}
            />
            <span>PODSTREAM</span>
          </div>
          <ul>
            <li>
              <Link to={`/`} className="w3-button">
                <FontAwesomeIcon className="FontAwesomeIcon" icon={faHouse} />
                DashBoard
              </Link>
            </li>
            <li>
              <Link to={`/search`} className="w3-button">
                <FontAwesomeIcon
                  className="FontAwesomeIcon"
                  icon={faMagnifyingGlass}
                />
                Search
              </Link>
            </li>
            <li>
              <Link to={`/favourites`} className="w3-button">
                <FontAwesomeIcon className="FontAwesomeIcon" icon={faHeart} />
                Favourites
              </Link>
            </li>
            <hr />
            {token && role === "creator" && (
              <li>
                <Link to={`/upload`} className="w3-button">
                  <FontAwesomeIcon
                    className="FontAwesomeIcon"
                    icon={faCloudArrowUp}
                  />
                  Upload
                </Link>
              </li>
            )}
            {token ? (
              <li className="logout-button">
                <Link to={`/auth`} onClick={logout}>
                  <FontAwesomeIcon
                    className="FontAwesomeIcon"
                    icon={faArrowRightToBracket}
                    style={{ color: "red" }}
                  />
                  Logout
                </Link>
              </li>
            ) : (
              <li>
                <Link to={`/auth`} className="w3-button">
                  <FontAwesomeIcon
                    className="FontAwesomeIcon"
                    icon={faArrowRightToBracket}
                  />
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SideBar;
