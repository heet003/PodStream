import React, { useEffect, useState } from "react";
import "./DashBoard.css";
import PodcastCard from "../Shared/UIElements/PodcastCard";
import { useAuth } from "../hooks/auth-hook";
import ErrorModal from "../Shared/UIElements/ErrorModal";
import LoadingSpinner from "../Shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";

function DashBoard() {
  const { token } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [history, setHistory] = useState([]);
  const [trueCrime, setTrueCrime] = useState([]);
  const [science, setScience] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [entertainment, setEntertainment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resData = await sendRequest(
        "http://localhost:5000/api/podcasts/",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      setHistory(resData.podcasts.slice(0, 4));
      setTrueCrime(resData.podcasts.slice(4, 4 * 2));
      setScience(resData.podcasts.slice(4 * 2, 4 * 3));
      setTechnology(resData.podcasts.slice(4 * 3, 4 * 4));
      setEntertainment(resData.podcasts.slice(4 * 4, 4 * 5));
    };
    fetchData();
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
            name={podcast.podcast.name}
            htmlDescription={podcast.htmlDescription}
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
        <div className="dashboard-genre">
          {renderPodcasts("History", history)}
        </div>
        <div className="dashboard-genre">
          {renderPodcasts("True Crime", trueCrime)}
        </div>
        <div className="dashboard-genre">
          {renderPodcasts("Science", science)}
        </div>
        <div className="dashboard-genre">
          {renderPodcasts("Technology", technology)}
        </div>
        <div className="dashboard-genre">
          {renderPodcasts("Entertainment", entertainment)}
        </div>
      </div>
    </React.Fragment>
  );
}

export default DashBoard;
