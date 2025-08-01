import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaPlay,
} from "react-icons/fa";
import useWatchlist from "../hooks/useWatchlist";
import MovieReviews from "./MovieReviews";

const MoviePage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { isInWatchlist, addMovie, removeMovie } = useWatchlist();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [movieId]);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US`
      );
      const data = await res.json();
      setMovie(data);
    };

    const fetchTrailer = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=8265bd1679663a7ea12ac168da84d2e8`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) setTrailerKey(trailer.key);
    };

    const fetchSimilar = async () => {
      const res = await fetch(`http://localhost:5000/api/similar/${movieId}`);
      const data = await res.json();
      setSimilarMovies(data.similar_movies || []);
    };

    fetchMovie();
    fetchTrailer();
    fetchSimilar();
    setShowTrailer(false);
    setShowReviewForm(false);
  }, [movieId]);

  const handleWatchlist = () => {
    const movieObj = {
      movieId: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      release_date: movie.release_date,
      rating: movie.vote_average,
    };

    isInWatchlist(movie.id)
      ? removeMovie(movie.id)
      : addMovie(movieObj);
  };

  if (!movie) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="text-white p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-64 rounded-xl shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="italic text-gray-400">{movie.tagline}</p>
          <p className="text-sm text-gray-300 mt-2">{movie.overview}</p>

          <div className="mt-4 space-y-1 text-sm text-gray-400">
            <p><strong>Release:</strong> {movie.release_date}</p>
            <p><strong>Runtime:</strong> {movie.runtime} mins</p>
            <p><strong>Rating:</strong> ⭐ {movie.vote_average}</p>
            <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ")}</p>
          </div>

          <div className="mt-4 flex gap-4 flex-wrap">
            <button
              onClick={handleWatchlist}
              className={`flex items-center gap-2 px-4 py-2 rounded font-semibold ${
                isInWatchlist(movie.id)
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-700 text-white"
              }`}
            >
              {isInWatchlist(movie.id) ? <FaStar /> : <FaRegStar />}
              {isInWatchlist(movie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
            </button>

            {trailerKey && (
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                <FaPlay /> Watch Trailer
              </button>
            )}

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {showReviewForm ? "Close Reviews" : "Write a Review"}
            </button>
          </div>
        </div>
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur">
          <div className="relative w-full max-w-6xl h-[80vh] bg-black rounded-lg shadow-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-4 text-white text-3xl font-bold hover:text-red-500"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* REVIEW POPUP */}
      {showReviewForm && (
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-lg p-6 rounded-lg max-w-3xl shadow-lg">
          <MovieReviews movieId={movie.id} />
        </div>
      )}

      {/* SIMILAR MOVIES */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
        {similarMovies.length === 0 ? (
          <p className="text-gray-400 italic">No similar movies found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarMovies.map((sim) => (
              <div
                key={sim.movieId}
                onClick={() => window.location.href = `/movie/${sim.movieId}`}
                className="cursor-pointer hover:scale-105 transition"
              >
                <img
                  src={sim.poster}
                  alt={sim.title}
                  className="w-full h-60 object-cover rounded shadow"
                />
                <p className="mt-2 text-center text-sm">{sim.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
