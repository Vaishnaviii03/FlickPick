import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieReviews = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch reviews on load or movieId change
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/reviews/${movieId}`)
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(() => {
        setReviews([]);
        setLoading(false);
      });
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/reviews/${movieId}`, { rating, text });
      setReviews(prev => [...prev, res.data.review]);
      setText("");
      setRating(5);
    } catch (err) {
      setError("Failed to submit review.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">User Ratings & Reviews</h3>

      {loading ? (
        <p className="text-gray-400">Loading reviews...</p>
      ) : (
        <>
          {reviews.length === 0 && <p className="text-gray-400">No reviews yet. Be the first!</p>}

          <ul className="space-y-3 max-h-48 overflow-y-auto">
            {reviews.map((r) => (
              <li key={r.id} className="bg-gray-800 p-3 rounded shadow-sm">
                <div>
                  <strong>⭐ {r.rating} / 5</strong>
                </div>
                <p className="text-gray-300">{r.text || <em>No comment</em>}</p>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <label className="block">
              Your Rating:
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="ml-2 bg-gray-700 rounded p-1"
              >
                {[5,4,3,2,1].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>

            <label className="block">
              Your Review:
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="3"
                className="w-full bg-gray-700 rounded p-2 mt-1 text-white"
                placeholder="Write a quick review..."
              />
            </label>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default MovieReviews;
