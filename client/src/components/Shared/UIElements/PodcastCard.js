import React, { useState } from "react";
import "./PodcastCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

function PodcastCard(props) {
  const [showFullDescription] = useState(false);

  function timeAgo(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  const renderDescription = (data) => {
    if (!data) return null;

    const description = data;
    const words = description.split(" ");
    if (words.length > 20) {
      const truncatedDescription = words.slice(0, 20).join(" ");
      return (
        <div className="alternate-p description">
          <b>Description</b>:
          {showFullDescription ? description : `${truncatedDescription}...`}
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
      <div className="card">
        {props.image && (
          <div className="cover-image">
            <Link
              to={
                props.id && props.category
                  ? `/podcast/${props.id}?param1=${encodeURIComponent(
                      props.category
                    )}`
                  : `/podcast/${props.id}`
              }
            >
              <img alt="podcast thumbnail" src={props.image} />
              <FontAwesomeIcon
                className="play-button"
                icon={faPlay}
                style={{ color: "#8c00ff" }}
              />
            </Link>
          </div>
        )}
        <div className="card-content">
          <div className="text-content">
            {props.title && <h3 className="title">{props.title}</h3>}
            {renderDescription(props.description)}
          </div>
        </div>
        <div className="card-footer">
          {props.avatar && (
            <img
              className="avatar"
              src={`${props.avatar}`}
              alt="user profile"
            />
          )}
          <div>
            {props.releaseDate && (
              <p className="date">Release Date: {timeAgo(props.releaseDate)}</p>
            )}
            <div>
              {props.share && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PodcastCard;
