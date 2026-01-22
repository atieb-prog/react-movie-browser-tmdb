import { Link } from "react-router-dom";
import { useWatchlist } from "../context/watchlistContext";
import { useEffect, useRef, useState } from "react";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      <Link
        to={`/movie/${movie.id}`}
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 shadow-sm" style={{ transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer" }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 0.5rem 1rem rgba(0,0,0,0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0,0,0,0.1)";
          }}
        >
        <div className="position-relative overflow-hidden">
          <img
            loading="lazy"
            src={
              isVisible && movie.poster_path
                ? `${IMAGE_BASE}${movie.poster_path}`
                : isVisible
                ? "placehold.co"
                : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750'/%3E"
            }
            className="card-img-top img-fluid"
            alt={movie.title}
            style={{
              backgroundColor: isVisible ? 'transparent' : '#e0e0e0',
              minHeight: '400px'
            }}
          />
          {/* Overlay for rating */}
          <div
            className="position-absolute top-0 end-0 m-2 px-2 py-1 bg-white bg-opacity-75 rounded"
            style={{ fontSize: "0.9rem" }}
          >
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
          {/* Watchlist Button */}
           <button
            className={`btn btn-sm position-absolute top-0 start-0 bg-dark m-2`}
            onClick={(e) => {
              e.preventDefault(); // stop Link navigation
              inWatchlist
                ? removeFromWatchlist(movie.id)
                : addToWatchlist(movie);
            }}
          >
            {inWatchlist ? "❤️" : "🤍"}
          </button>
        </div>
        <div className="card-body p-2 text-center">
          <h6 className="card-title fw-bold text-truncate mb-1 text-dark">{movie.title}</h6>
          <p className="card-text text-muted small mb-0">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </p>
        </div>
      </div>
    </Link>
    </div>
  );
} 
export default MovieCard;