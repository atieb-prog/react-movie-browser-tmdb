import { Link } from "react-router-dom";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  return (
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
            src={
              movie.poster_path
                ? `${IMAGE_BASE}${movie.poster_path}`
                : "placehold.co"
            }
            className="card-img-top img-fluid"
            alt={movie.title}
          />
          {/* Overlay for rating */}
          <div
            className="position-absolute top-0 end-0 m-2 px-2 py-1 bg-white bg-opacity-75 rounded"
            style={{ fontSize: "0.9rem" }}
          >
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
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
  );
} 
export default MovieCard;