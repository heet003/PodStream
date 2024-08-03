import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../hooks/auth-hook";
import {
  faMicrophone,
  faArrowRightToBracket,
  faGears,
  faHeart,
  faCloudArrowUp,
  faPhotoFilm,
  faMagnifyingGlass,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import "./SideBar.css";

function SideBar({ isOpen, onClose }) {
  const { token, logout, role } = useAuth();
  return (
    <React.Fragment>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div>
          <div className="logo-container">
            <NavLink to={`/auth`} className="w3-button">
              <FontAwesomeIcon
                className="logo-FontAwesomeIcon"
                icon={faMicrophone}
                style={{ color: "#ff8a8a", fontSize: "1.5rem" }}
              />
              <span>PODSTREAM</span>
            </NavLink>
          </div>
          <ul>
            <li>
              <NavLink to={`/`} className="w3-button" activeClassName="active">
                <FontAwesomeIcon className="FontAwesomeIcon" icon={faHouse} />
                Dashboard
              </NavLink>
            </li>
            {token && role === "admin" && (
              <li>
                <NavLink
                  to={`/admin`}
                  className="w3-button"
                  activeClassName="active"
                >
                  <FontAwesomeIcon
                    className="FontAwesomeIcon"
                    icon={faGears}
                    style={{ color: "#ffffff" }}
                  />
                  Admin Panel
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to={`/search`}
                className="w3-button"
                activeClassName="active"
              >
                <FontAwesomeIcon
                  className="FontAwesomeIcon"
                  icon={faMagnifyingGlass}
                />
                Search
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/favourites`}
                className="w3-button"
                activeClassName="active"
              >
                <FontAwesomeIcon className="FontAwesomeIcon" icon={faHeart} />
                Favourites
              </NavLink>
            </li>
            <hr />
            {token && role !== "user" && (
              <li>
                <NavLink
                  to={`/upload`}
                  className="w3-button"
                  activeClassName="active"
                >
                  <FontAwesomeIcon
                    className="FontAwesomeIcon"
                    icon={faCloudArrowUp}
                  />
                  Upload
                </NavLink>
              </li>
            )}
            {token && role !== "user" && (
              <li>
                <NavLink
                  to={`/pod-library`}
                  className="w3-button"
                  activeClassName="active"
                >
                  <FontAwesomeIcon
                    className="FontAwesomeIcon"
                    icon={faPhotoFilm}
                  />
                  My Podcasts
                </NavLink>
              </li>
            )}
            {token ? (
              <li className="logout-button">
                <NavLink
                  to={`/auth`}
                  onClick={logout}
                  className="w3-button"
                  activeClassName="active"
                >
                  <FontAwesomeIcon
                    className="FontAwesomeIcon"
                    icon={faArrowRightToBracket}
                    style={{ color: "red" }}
                  />
                  Logout
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink
                  to={`/auth`}
                  className="w3-button"
                  activeClassName="active"
                >
                  <FontAwesomeIcon
                    className="FontAwesomeIcon"
                    icon={faArrowRightToBracket}
                  />
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SideBar;
