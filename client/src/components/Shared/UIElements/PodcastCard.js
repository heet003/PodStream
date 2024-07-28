import React, { useState } from "react";
import "./PodcastCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

function PodcastCard(props) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  function timeAgo(dateString) {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderDescription = (data) => {
    if (!data) {
      return "Description not available";
    }

    const description = data;
    const words = description.split(" ");
    if (words.length > 20) {
      const truncatedDescription = words.slice(0, 20).join(" ");
      return (
        <div className="alternate-p description">
          <b>Description</b>:
          {showFullDescription ? description : `${truncatedDescription}...`}
          <p onClick={toggleDescription} className="read-more">
            {showFullDescription ? " Show Less" : " Read More"}
          </p>
        </div>
      );
    } else {
      return (
        <p>
          <b>Description</b>: {description}
        </p>
      );
    }
  };

  return (
    <div className="podcast-card-container">
      <Link to={`/podcast/${props.id}`}>
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
              {renderDescription(props.description)}
            </div>
          </div>
          <div className="card-footer">
            <img
              className="avatar"
              src={`${props.avatar}`}
              alt="user profile"
            />
            <div>
              <p className="date">Release Date: {timeAgo(props.releaseDate)}</p>

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
      </Link>
    </div>
  );
}

export default PodcastCard;
