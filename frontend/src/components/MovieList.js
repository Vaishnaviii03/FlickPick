import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ movies }) => {
  if (movies.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10 px-6">
      {movies.map((movie, idx) => (
        <MovieCard key={idx} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
