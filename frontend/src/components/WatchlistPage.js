import React from "react";
import useWatchlist from "../hooks/useWatchlist";
import MovieCard from "./MovieCard";

const WatchlistPage = () => {
  const { watchlist, removeMovie } = useWatchlist();

  if (watchlist.length === 0)
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-400">
        <h2 className="text-3xl font-bold mb-6">Your Watchlist is empty.</h2>
        <p>Start adding some movies by clicking the ⭐ buttons!</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-6">⭐ My Watchlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {watchlist.map((movie) => (
          <div key={movie.movieId} className="relative">
            <MovieCard movie={movie} />
            <button
              onClick={() => removeMovie(movie.movieId)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-lg"
              title="Remove from Watchlist"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistPage;
