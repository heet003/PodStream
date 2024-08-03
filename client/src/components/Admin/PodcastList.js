import React, { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import { useAuth } from "../hooks/auth-hook";
import PodcastCard from "../Shared/UIElements/PodcastCard";
import "./Admin.css";

const PodcastList = () => {
  const { token, role } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/podcasts/",
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setPodcasts(responseData.podcasts);
      } catch (err) {
        console.log(err);
      }
    };
    if (token && role === "admin") {
      fetchPodcasts();
    }
  }, [sendRequest, token, role]);

  const deleteUser = async (podcastId) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/podcasts/delete/${podcastId}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );
      setPodcasts((prevPodcasts) =>
        prevPodcasts.filter((pod) => pod.id !== podcastId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const renderPodcasts = (genreName, podcasts) => (
    <React.Fragment>
      <h2>{genreName} Podcasts</h2>
      <div className="pod-grid">
        <div className="podcasts">
          {podcasts.map((podcast) => (
            <React.Fragment>
              <PodcastCard
                key={podcast.id}
                id={podcast._id}
                title={podcast.name}
                name={podcast.podcast.name}
                htmlDescription={podcast.htmlDescription}
                avatar={podcast.cover[2].url}
                image={podcast.cover[2].url}
                description={podcast.description}
                share={podcast.podcast.shareUrl}
                releaseDate={podcast.date}
              />
              <div className="podcast-actions">
                <button className="edit-icon">
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  className="delete-icon"
                  onClick={() => deleteUser(podcast._id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} /> Delete
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <div>{podcasts && renderPodcasts("Podcasts", podcasts)}</div>
    </React.Fragment>
  );
};

export default PodcastList;
