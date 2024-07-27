import React from "react";
import "./PodcastCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faShareNodes } from "@fortawesome/free-solid-svg-icons";

function PodcastCard(props) {
  return (
    <div className="podcast-card-container">
      <div className="card">
        <div className="cover-image">
          <img alt="podcast thumbnail" src={props.image} />
          <FontAwesomeIcon
            className="play-button"
            icon={faPlay}
            style={{ color: "#8c00ff" }}
          />
        </div>
        <div className="card-content">
          <div className="text-content">
            <h3 className="title">{props.title}</h3>
            <p className="description">{props.description} </p>
          </div>
        </div>
        <div className="card-footer">
          <img
            className="avatar"
            src="https://via.placeholder.com/50"
            alt="user profile"
          />
          <div>
            <p className="views">Views: {props.views} </p>
            <p className="date">Release Date: {props.releaseDate} </p>

            <a
              className="share"
              href={`${props.share}`}
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faShareNodes}
                style={{ color: "#8c00ff" }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PodcastCard;
