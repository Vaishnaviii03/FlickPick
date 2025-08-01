import React from "react";
import { useNavigate } from "react-router-dom";
import useWatchlist from "../hooks/useWatchlist";
import { FaRegStar, FaStar } from "react-icons/fa";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { isInWatchlist, addMovie, removeMovie } = useWatchlist();

  const handleToggleWatchlist = (e) => {
    e.stopPropagation(); // Prevent click from triggering page navigation
    isInWatchlist(movie.movieId)
      ? removeMovie(movie.movieId)
      : addMovie(movie);
  };

  const handleClick = () => {
    navigate(`/movie/${movie.movieId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300 ease-in-out"
    >
      <img
        src={movie.poster || "/no-poster.png"}
        alt={movie.title}
        className="w-full h-72 object-cover"
      />

      {/* ⭐ Watchlist Icon */}
      <button
        onClick={handleToggleWatchlist}
        className="absolute top-2 right-2 text-yellow-400 text-xl z-10"
        title={
          isInWatchlist(movie.movieId)
            ? "Remove from Watchlist"
            : "Add to Watchlist"
        }
      >
        {isInWatchlist(movie.movieId) ? <FaStar /> : <FaRegStar />}
      </button>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{movie.title}</h2>

        {(movie.rating || movie.release_date) && (
          <p className="text-sm text-gray-300">
            {movie.rating && `⭐ ${movie.rating}`}{" "}
            {movie.release_date && `| 📅 ${movie.release_date}`}
          </p>
        )}

        {movie.genre && (
          <p className="mt-2 text-sm text-gray-400">{movie.genre}</p>
        )}

        {movie.synopsis && (
          <p className="text-sm mt-2 text-gray-400 line-clamp-3">
            {movie.synopsis}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
