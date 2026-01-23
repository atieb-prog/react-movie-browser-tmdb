import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useWatchlist } from "@context/watchlistContext.jsx";

function Navbar() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundColor: "#0f0f0f",
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          MovieApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                href="#"
                id="watchlistDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
              >
                Watchlist{" "}
                <span className="badge bg-danger">{watchlist.length}</span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-lg-end p-2 watchlist-dropdown"
              >
                {watchlist.length === 0 ? (
                  <li className="dropdown-item text-muted">
                    No movies in watchlist
                  </li>
                ) : (
                  watchlist.map((movie) => (
                    <li
                      key={movie.id}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <Link
                        to={`/movie/${movie.id}`}
                        className=" text-decoration-none fw-bold text-dark flex-grow-1"
                      >
                        {movie.title}
                      </Link>
                      <img
                        src={
                          movie.poster_path
                            ? `${IMAGE_BASE}${movie.poster_path}`
                            : "placehold.co"
                        }
                        alt={movie.title}
                        className="img-fluid rounded"
                        style={{
                          width: "40px",
                          height: "60px",
                          objectFit: "cover",
                          marginLeft: "10px",
                        }}
                      />
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => removeFromWatchlist(movie.id)}
                      >
                        &times;
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;