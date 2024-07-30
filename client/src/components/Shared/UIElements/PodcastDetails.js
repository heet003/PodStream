import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth-hook";
import ErrorModal from "./ErrorModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlay } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "./LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";
import { format } from "date-fns";
import "./PodcastCard.css";

function PodcastDetails(props) {
  const { token } = useAuth();
  const [data, setData] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const resData = await sendRequest(
        `http://localhost:5000/api/podcasts/${id}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      setData(resData.details);

      const responseData = await sendRequest(
        `http://localhost:5000/api/podcasts/user/likes`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      const userLikes = responseData.likes;
      console.log(userLikes);
      const liked = userLikes.some((like) => like.podcastId === id);
      setIsLiked(liked);
    }

    if (token) {
      fetchData();
    }
  }, [token, sendRequest, id]);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes} min ${seconds} sec`;
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  async function handleLike() {
    const resData = await sendRequest(
      `http://localhost:5000/api/podcasts/like/${id}`,
      "GET",
      null,
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    setData(resData.details);
  }

  return (
    <React.Fragment>
      <div className="pod-cont">
        {isLoading && <LoadingSpinner asOverlay />}
        <ErrorModal error={error} onClear={clearError} />
        {data && (
          <div className="pod-details">
            <div>
              <img
                className="pod-cover"
                src={data.cover[1].url}
                alt="Cover"
                width="300"
              />
            </div>
            <div>
              <div>
                <h2 className="pod-h2">
                  {data.name}
                  <button
                    className={`like-button ${isLiked ? "liked" : "notliked"}`}
                    onClick={handleLike}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </h2>
                <h3 className="pod-h3">{data.podcast.name}</h3>
              </div>
              <a href={data.shareUrl} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon
                  className="play-details"
                  icon={faPlay}
                  style={{ color: "#8c00ff" }}
                />
              </a>
              <div>
                <p className="pod-date">{formatDate(data.date)}</p>
                <div className="dot" />
                <p className="pod-duration">
                  {formatDuration(data.durationMs)}
                </p>
                <p className="pod-exp">{data.explicit && "18+ Content"}</p>
              </div>
              <div className="desc-box">
                <h3>Episode Description</h3>
                <p className="pod-desc">{data.description}</p>
              </div>

              <audio className="pod-audio" controls>
                <source src={data.audioPreviewUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default PodcastDetails;
