import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./Favourites.css";
import { useAuth } from "../hooks/auth-hook";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import PodcastCard from "../Shared/UIElements/PodcastCard";

function Favourites() {
  const { token } = useAuth();
  const [fav, SetFav] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchData = async () => {
      const resData = await sendRequest(
        "http://localhost:5000/api/podcasts/user/favourites",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      SetFav(resData.results);
    };
    if (token) {
      fetchData();
    }
  }, [sendRequest, token]);

  const renderPodcasts = (genreName, podcasts) => (
    <div>
      <h2>{genreName} Podcasts</h2>
      <div className="podcasts">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            id={podcast._id}
            title={podcast.name}
            avatar={podcast.cover[2].url}
            image={podcast.cover[2].url}
            description={podcast.description}
            share={podcast.podcast.shareUrl}
            releaseDate={podcast.date}
          />
        ))}
      </div>
    </div>
  );
  
  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <div>
        <div className="fav-container">
          <input type="text" placeholder="Favourite Podcast" />
          <FontAwesomeIcon
            className="FontAwesomeIcon"
            icon={faMagnifyingGlass}
          />
        </div>
        <h3>Browse All</h3>
        <div> {renderPodcasts("Favourites", fav)}</div>
      </div>
    </React.Fragment>
  );
}

export default Favourites;
