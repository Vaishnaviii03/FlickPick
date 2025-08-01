// src/components/Trending.js
import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';

export default function Trending() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/trending`
    )
      .then(res => res.json())
      .then(data => {
        setMovies(data.top_movies || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch trending:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-400 mt-10">
        Loading Trending…
      </p>
    );
  }

  if (!movies.length) {
    return (
      <p className="text-center text-gray-400 mt-10">
        No trending movies right now.
      </p>
    );
  }

  return (
    <div className="px-6 mt-10">
      <h2 className="text-3xl font-bold text-white mb-6">
        🔥 Trending Now
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie, idx) => (
          <MovieCard key={idx} movie={movie} />
        ))}
      </div>
    </div>
  );
}
