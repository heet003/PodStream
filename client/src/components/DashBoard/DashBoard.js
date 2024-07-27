import React from "react";
import "./DashBoard.css";
import PodcastCard from "../Shared/UIElements/PodcastCard";

const podcasts = {
  history: [
    {
      id: "1",
      name: "Selects: The Tulsa 'Race Riots'",
      description:
        "In reality, the Tulsa 'race riots' of 1921 was more like a massacre...",
      releaseDate: "2024-07-27",
      shareUrl: "https://open.spotify.com/episode/1OxjrshaAHjn2uCN5pVQ1p",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
    {
      id: "2",
      name: "The Ritchie Boys",
      description: "Who were the Ritchie Boys? Listen in to find out...",
      releaseDate: "2024-07-24",
      shareUrl: "https://open.spotify.com/episode/2RitchieBoys",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
    {
      id: "3",
      name: "The Silk Roads",
      description: "Explore the history of the Silk Roads...",
      releaseDate: "2024-06-15",
      shareUrl: "https://open.spotify.com/episode/3SilkRoads",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
    {
      id: "4",
      name: "The Silk Roads",
      description: "Explore the history of the Silk Roads...",
      releaseDate: "2024-06-15",
      shareUrl: "https://open.spotify.com/episode/3SilkRoads",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
  ],
  trueCrime: [
    {
      id: "4",
      name: "The KILLDOZER Rampage",
      description: "The Killdozer rampage is one of those stories...",
      releaseDate: "2024-07-25",
      shareUrl: "https://open.spotify.com/episode/4Killdozer",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
    {
      id: "5",
      name: "The Zodiac Killer",
      description: "An exploration of the infamous Zodiac Killer...",
      releaseDate: "2024-05-10",
      shareUrl: "https://open.spotify.com/episode/5ZodiacKiller",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
    {
      id: "6",
      name: "The Mystery of DB Cooper",
      description: "The unsolved case of DB Cooper...",
      releaseDate: "2024-04-20",
      shareUrl: "https://open.spotify.com/episode/6DBCooper",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
  ],
  science: [
    {
      id: "7",
      name: "Short Stuff: Amber Alerts",
      description: "Learn about the history and impact of Amber Alerts...",
      releaseDate: "2024-05-02",
      shareUrl: "https://open.spotify.com/episode/7AmberAlerts",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
    {
      id: "8",
      name: "The Science of Sleep",
      description: "Exploring the mysteries of sleep and dreams...",
      releaseDate: "2024-06-10",
      shareUrl: "https://open.spotify.com/episode/8ScienceOfSleep",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
    {
      id: "9",
      name: "Climate Change Explained",
      description: "Understanding the science behind climate change...",
      releaseDate: "2024-07-05",
      shareUrl: "https://open.spotify.com/episode/9ClimateChange",
      coverArt:
        "https://i.scdn.co/image/ab6765630000ba8a863cc2d69ef7958af5cca4b5",
    },
  ],
};

function DashBoard(props) {
  return (
    <div>
      {Object.entries(podcasts).map(([genre, podcastArray]) => (
        <div key={genre}>
          <h2>{genre.charAt(0).toUpperCase() + genre.slice(1)} Podcasts</h2>
          <div className="podcasts">
            {podcastArray.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                title={podcast.name}
                image={podcast.coverArt}
                description={podcast.description}
                views={podcast.views}
                share={podcast.shareUrl}
                releaseDate={podcast.releaseDate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashBoard;
