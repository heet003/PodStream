import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Category } from "../../utils/Data";
import "./SearchPodcast.css";
import { useAuth } from "../hooks/auth-hook";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import PodcastCard from "../Shared/UIElements/PodcastCard";

function SearchPodcast() {
  const { token } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resData = await sendRequest(
        `http://localhost:5000/api/podcasts/category/${selectedCategory}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      setPodcasts(resData.results);
    };
    if (token && selectedCategory) {
      fetchData();
    }
  }, [selectedCategory, token, sendRequest]);

  const renderPodcasts = (genreName, podcasts) => (
    <div>
      <h3>Podcasts in {selectedCategory}</h3>
      <div className="podcasts">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            id={podcast._id}
            title={podcast.name}
            avatar={podcast.cover[2].url}
            image={podcast.cover[2].url}
            share={podcast.shareUrl}
            description={podcast.description}
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
        <div className="search-container">
          <input type="text" placeholder="Search Podcast" />
          <FontAwesomeIcon
            className="FontAwesomeIcon"
            icon={faMagnifyingGlass}
          />
        </div>
        <h3>Browse All</h3>
        {!selectedCategory && (
          <div className="genres-box">
            {Category.map((element) => (
              <div
                key={element.name}
                className="genre-item"
                style={{ background: element.color }}
                onClick={() => setSelectedCategory(element.name)}
              >
                <h2>{element.name}</h2>
                <img
                  src={element.img}
                  alt={element.name}
                  className="genre-img"
                />
              </div>
            ))}
          </div>
        )}
        {selectedCategory && podcasts.length > 0 && (
          <div>
            <div> {renderPodcasts(selectedCategory, podcasts)}</div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default SearchPodcast;
