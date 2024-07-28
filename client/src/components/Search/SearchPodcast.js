import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Category } from "../../utils/Data";
import "./SearchPodcast.css";

function SearchPodcast() {
  return (
    <React.Fragment>
      <div>
        <div className="search-container">
          <input type="text" placeholder="Search Podcast" />
          <FontAwesomeIcon
            className="FontAwesomeIcon"
            icon={faMagnifyingGlass}
          />
        </div>
        <h3>Browse All</h3>
        <div className="genres-box">
          {Category.map((element) => (
            <div
              key={element.name}
              className="genre-item"
              style={{ background: element.color }}
            >
              <h2>{element.name}</h2>
              <img src={element.img} alt={element.name} className="genre-img" />
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

export default SearchPodcast;
