import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/auth-hook";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import PodcastCard from "../Shared/UIElements/PodcastCard";

function UserPodcasts() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [fav, SetFav] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = searchQuery ? `?search=${searchQuery}` : "";
      const resData = await sendRequest(
        `http://localhost:5000/api/podcasts/user-podcasts${queryParams}`,
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
          <input
            type="text"
            placeholder="Search Your Podcasts"
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
          <div> {renderPodcasts("Uploded", fav)}</div>
        ) : (
          <div>
            <p>No Podcasts Uploaded.</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default UserPodcasts;
