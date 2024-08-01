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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let url = `http://localhost:5000/api/podcasts`;
      if (selectedCategory) {
        url += `/category/${selectedCategory}`;
      }
      if (searchQuery) {
        url += `/search/${searchQuery}`;
      }

      const resData = await sendRequest(url, "GET", null, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      setPodcasts(resData.results);
    };
    if (token) {
      fetchData();
    }
  }, [selectedCategory, token, sendRequest, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderPodcasts = (genreName, podcasts) => (
    <div>
      <h3>
        {selectedCategory
          ? `Podcasts in ${selectedCategory}`
          : `Showing Results for ${searchQuery}`}
      </h3>
      <div className="podcasts">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            id={podcast._id}
            category={selectedCategory}
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
        {!selectedCategory && (
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Podcast"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon
              className="FontAwesomeIcon"
              icon={faMagnifyingGlass}
            />
          </div>
        )}
        <h3>Browse All</h3>
        {!podcasts && (
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
        {podcasts ? (
          <div> {renderPodcasts("Favourites", podcasts)}</div>
        ) : (
          <div>
            <p>No Podcasts to show.</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default SearchPodcast;
