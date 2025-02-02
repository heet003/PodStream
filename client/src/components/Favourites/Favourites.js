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
  const [searchQuery, setSearchQuery] = useState("");

  const [fav, SetFav] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = searchQuery ? `?search=${searchQuery}` : "";
      const resData = await sendRequest(
        `http://localhost:5000/api/podcasts/user/favourites${queryParams}`,
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
  }, [sendRequest, token, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderPodcasts = (genreName, podcasts) => (
    <div>
      <h2>{genreName} Podcasts</h2>
      <div className="podcasts">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast._id}
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
          <input
            type="text"
            placeholder="Favourite Podcast"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FontAwesomeIcon
            className="FontAwesomeIcon"
            icon={faMagnifyingGlass}
          />
        </div>
        <h3>Browse All</h3>
        {fav.length > 0 ? (
          <div> {renderPodcasts("Favourites", fav)}</div>
        ) : (
          <div>
            <p>No Favourites to show.</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default Favourites;
