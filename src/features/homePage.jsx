import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getTrendingMovies,
  searchMovies,
} from "@services/movieServices.js";
import MovieCard from "@components/MovieCard.jsx";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const abortRef = useRef(null);

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "popular";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    if (searchQuery.trim()) return;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        let response = {};

        if (category === "popular") {
          response = await getPopularMovies(currentPage);
        } else if (category === "top_rated") {
          response = await getTopRatedMovies(currentPage);
        } else if (category === "upcoming") {
          response = await getUpcomingMovies(currentPage);
        } else if (category === "now_playing") {
          response = await getNowPlayingMovies(currentPage);
        } else if (category === "trending") {
          response = await getTrendingMovies("week", currentPage);
        }
        setMovies(response.results || []);
        setFilteredMovies(response.results || []);
        setTotalPages(response.total_pages || 1);
      } catch (err) {
        console.error(err);
        setError(
          `Failed to load ${category.replace(
            "_",
            " "
          )} movies. Please try again.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category, searchQuery, currentPage]);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await searchMovies(searchQuery, currentPage, {
          signal: controller.signal,
        });
        setFilteredMovies(response.results || []);
        setTotalPages(response.total_pages || 1);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(`Failed to search for "${searchQuery}". Please try again.`);
        }
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchQuery, currentPage]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#0f0f0f",
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        <div
          className="position-relative overflow-hidden py-5 mb-4"
          style={{
            background:
              "linear-gradient(45deg, #101820 30%, #008080 50%, #101820 70%)",
            borderRadius: "0 0 50px 50px",
          }}
        >
          <Container className="py-5 text-center">
            <h1 className="display-6 fw-bold display-md-5">
              Discover <span className="text-white">Amazing Movies</span>
            </h1>
            <p className="lead mt-3 text-white fs-6 fs-md-5">
              Explore trending, top-rated, and upcoming blockbusters
            </p>

            <div className="mx-auto" style={{ maxWidth: "600px" }}>
              <div className="input-group input-group-lg shadow-lg border-0">
                <span className="input-group-text bg-white border-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Search movies..."
                  value={searchQuery}
                  style={{ fontSize: "1.1rem" }}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchParams(
                      val.trim()
                        ? { search: val, page: "1" }
                        : { category, page: "1" }
                    );
                  }}
                />
              </div>
            </div>
          </Container>
        </div>
        <Container>
          <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
            {[
              { key: "popular", label: "🔥 Popular", color: "danger" },
              { key: "top_rated", label: "⭐ Top Rated", color: "warning" },
              { key: "upcoming", label: "📅 Upcoming", color: "info" },
              { key: "now_playing", label: "🎬 Now Playing", color: "success" },
              { key: "trending", label: "📈 Trending", color: "primary" },
            ].map((cat) => (
              <button
                key={cat.key}
                className={`btn rounded-pill px-4 transition-all ${
                  category === cat.key && !searchQuery
                    ? `btn-${cat.color}`
                    : "btn-outline-light"
                }`}
                style={{ transition: "0.3s" }}
                onClick={() => {
                  setSearchParams({ category: cat.key, page: "1" });
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="d-flex align-items-center mb-4">
            <h3 className="mb-0 text-capitalize fs-5">
              {searchQuery
                ? "🔍 Search Results"
                : `🔥 ${category.replace("_", " ")} Movies`}
            </h3>
            <div className="flex-grow-1 ms-3 border-top border-danger opacity-10"></div>
          </div>

          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(null)}
              className="mb-4"
            >
              <Alert.Heading>⚠️ Oops! Something went wrong</Alert.Heading>
              <p className="mb-0">{error}</p>
            </Alert>
          )}

          {loading && filteredMovies.length > 0 && (
            <div className="text-center mb-4">
              <Spinner animation="border" variant="danger" size="sm" />
              <span className="ms-2">Updating...</span>
            </div>
          )}

          {loading && filteredMovies.length === 0 && (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" variant="danger" />
            </div>
          )}

          <Row className="g-4">
            {!loading && !error && filteredMovies.length === 0 && (
              <Col xs={12}>
                <p className="text-center text-muted-light">
                  {searchQuery
                    ? `No movies found for "${searchQuery}"`
                    : "No movies found."}
                </p>
              </Col>
            )}

            {filteredMovies.map((movie) => (
              <Col
                key={movie.id}
                xs={12}
                sm={4}
                md={3}
                lg={3}
                className="animate__animated animate__fadeIn"
              >
                <div className="movie-card-wrapper h-100 hover-lift">
                  <MovieCard movie={movie} />
                </div>
              </Col>
            ))}
          </Row>

          {/* Pagination Controls */}
          {!loading &&
            !error &&
            filteredMovies.length > 0 &&
            totalPages > 1 && (
              <div
                className="d-flex justify-content-center align-items-center gap-1 gap-md-2 my-5"
                style={{ maxWidth: "100vw", overflowX: "hidden" }}
              >
                <button
                  className="btn btn-dark border-secondary rounded-circle"
                  style={{ width: "45px", height: "45px" }}
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    const params = searchQuery
                      ? { search: searchQuery, page: newPage.toString() }
                      : { category: category, page: newPage.toString() };
                    setSearchParams(params);
                  }}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>

                {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                  .filter((p) => p > 0 && p <= Math.min(totalPages, 500))
                  .map((p) => (
                    <button
                      key={p}
                      className={`btn rounded-circle ${
                        p === currentPage
                          ? "btn-danger"
                          : "btn-outline-dark border-0 bg-white"
                      }`}
                      style={{ width: "45px", height: "45px" }}
                      onClick={() => {
                        const params = searchQuery
                          ? { search: searchQuery, page: p.toString() }
                          : { category: category, page: p.toString() };
                        setSearchParams(params);
                      }}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  className="btn btn-dark border-secondary rounded-circle"
                  style={{ width: "45px", height: "45px" }}
                  onClick={() => {
                    const newPage = Math.min(totalPages, currentPage + 1);
                    const params = searchQuery
                      ? { search: searchQuery, page: newPage.toString() }
                      : { category: category, page: newPage.toString() };
                    setSearchParams(params);
                  }}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
        </Container>
      </div>
    </>
  );
};

export default HomePage;
