import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const WATCHLIST_KEY = "flickpick_watchlist";

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
  }, []);

  const save = (newList) => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newList));
    setWatchlist(newList);
  };

  const addMovie = (movie) => {
    if (!watchlist.find((m) => m.movieId === movie.movieId)) {
      save([...watchlist, movie]);
      toast.success(`"${movie.title}" added to watchlist!`);
    }
  };

  const removeMovie = (movieId) => {
    const movie = watchlist.find((m) => m.movieId === movieId);
    save(watchlist.filter((m) => m.movieId !== movieId));
    if (movie) toast(`${movie.title} removed from watchlist.`);
  };

  const isInWatchlist = (movieId) =>
    watchlist.some((m) => m.movieId === movieId);

  return { watchlist, addMovie, removeMovie, isInWatchlist };
}
