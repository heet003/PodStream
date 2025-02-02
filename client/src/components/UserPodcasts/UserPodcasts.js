import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/auth-hook";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import PodcastCard from "../Shared/UIElements/PodcastCard";
import UploadPodcast from "../UploadPodcast/UploadPodcast";
import "../Favourites/Favourites.css";

function UserPodcasts() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [fav, SetFav] = useState([]);
  const [editingPodcast, setEditingPodcast] = useState(null);
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

  const handleEdit = (podcast) => {
    setEditingPodcast(podcast);
  };

  const handleDelete = async (podcastId) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/podcasts/delete/${podcastId}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      SetFav((prevFav) =>
        prevFav.filter((podcast) => podcast._id !== podcastId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSuccess = () => {
    setEditingPodcast(null);
  };

  const renderPodcasts = (genreName, podcasts) => (
    <div>
      <h2>{genreName} Podcasts</h2>
      <div className="podcasts">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="podcast-item">
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
            <div className="podcast-actions">
              <button className="edit-icon" onClick={() => handleEdit(podcast)}>
                <FontAwesomeIcon icon={faEdit} /> Edit
              </button>
              <button
                className="delete-icon"
                onClick={() => handleDelete(podcast._id)}
              >
                <FontAwesomeIcon icon={faTrashAlt} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      {!editingPodcast && (
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
            <div>{renderPodcasts("Uploaded", fav)}</div>
          ) : (
            <div>
              <p>No Podcasts Uploaded.</p>
            </div>
          )}
        </div>
      )}
      {editingPodcast && (
        <UploadPodcast
          podcast={editingPodcast}
          onEditSuccess={handleEditSuccess}
        />
      )}
    </React.Fragment>
  );
}

export default UserPodcasts;
