import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import { useNavigate } from "react-router-dom";

const tabs = [
  { key: "trending", label: "🔥 Trending" },
  { key: "personalized", label: "🎬 Personalized" },
  { key: "genre", label: "🎭 By Genre" },
  { key: "actor", label: "🧑‍🎤 By Actor" },
  { key: "director", label: "🎬 By Director" },
];

const Recommendation = () => {
  const [selectedTab, setSelectedTab] = useState("trending");
  const [userId, setUserId] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [genre, setGenre] = useState("");
  const [actor, setActor] = useState("");
  const [director, setDirector] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/trending");
      setMovies(data.top_movies || []);
    } catch (error) {
      console.error("Error loading trending:", error);
      setMovies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setMovies([]);
    setLoading(false);
    setSelectedMovie(""); // reset input on tab change
    setGenre("");
    setActor("");
    setDirector("");
    if (selectedTab === "trending") {
      fetchTrending();
    }
  }, [selectedTab]);

  const handleSubmit = async () => {
    setLoading(true);
    let endpoint = "";
    let payload = {};

    try {
      if (selectedTab === "personalized") {
        endpoint = "/api/recommend";
        payload = { userId, movie: selectedMovie };
      } else if (selectedTab === "genre") {
        endpoint = "/api/top_by_genre";
        payload = { genre };
      } else if (selectedTab === "actor") {
        endpoint = "/api/top_by_actor";
        payload = { actor };
      } else if (selectedTab === "director") {
        endpoint = "/api/top_by_director";
        payload = { director };
      }

      const { data } = await axios.post(`http://localhost:5000${endpoint}`, payload);
      setMovies(
        selectedTab === "personalized"
          ? data.recommendations || []
          : data.top_movies || []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setMovies([]);
    }

    setLoading(false);
  };

  const handleMovieClick = (movieId) => {
    // Navigate to MoviePage
    navigate(`/movie/${movieId}`);
  };

  const renderMovieGrid = () => {
    if (loading) {
      return <div className="text-center text-lg py-8 animate-pulse">Loading...</div>;
    }
    if (movies.length === 0) {
      return <div className="text-center text-gray-400 py-8">No movies found.</div>;
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie, idx) => (
          <MovieCard
            key={idx}
            movie={movie}
            onClick={handleMovieClick}
          />
        ))}
      </div>
    );
  };

  const renderForm = () => {
    if (selectedTab === "trending") return null;

    switch (selectedTab) {
      case "personalized":
        return (
          <>
            <input
              type="number"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full md:w-1/4 p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
            <input
              type="text"
              placeholder="Enter movie title"
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="w-full md:w-1/2 p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
          </>
        );
      case "genre":
        return (
          <input
            type="text"
            placeholder="Enter genre (e.g. Comedy)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full md:w-1/2 p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
        );
      case "actor":
        return (
          <input
            type="text"
            placeholder="Enter actor name"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            className="w-full md:w-1/2 p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
        );
      case "director":
        return (
          <input
            type="text"
            placeholder="Enter director name"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            className="w-full md:w-1/2 p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      {/* Tabs */}
      <div className="flex justify-center flex-wrap gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedTab === tab.key
                ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {selectedTab !== "trending" && (
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {renderForm()}
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-300"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div>{renderMovieGrid()}</div>
    </div>
  );
};

export default Recommendation;
