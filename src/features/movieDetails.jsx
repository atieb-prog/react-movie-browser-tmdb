import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge, Spinner, Button } from "react-bootstrap";
import { getMovieDetails, getMovieCredits } from "@services/movieServices";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
        ]);
        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, [id]);

  if (loading) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-light">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3 fw-semibold">Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <Container className="mt-5 text-center">
        <p className="text-danger fw-semibold">{error || "Movie not found"}</p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </Container>
    );
  }

  const director = credits?.crew?.find((person) => person.job === "Director");
  const topCast = credits?.cast?.slice(0, 6) || [];

  return (
    <div
      style={{ backgroundColor: "#0f0f0f", minHeight: "100vh", color: "#fff",overflowX: "hidden" }}
    >
      <div
        className="position-relative"
        style={{ height: "60vh", overflow: "hidden" }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: `url(${IMAGE_BASE}${movie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4) grayscale(20%)",
          }}
        />
        <div
          className="position-absolute bottom-0 w-100"
          style={{
            height: "100%",
            background: "linear-gradient(to top, #0f0f0f, transparent)",
          }}
        />

        <Container className="position-relative h-100 d-flex align-items-end pb-4">
          <Button
            variant="link"
            className="position-absolute top-0 start-0 mt-4 ms-3 text-white text-decoration-none bg-dark bg-opacity-50 rounded-pill px-3 py-1"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <div className="animate__animated animate__fadeInUp px-2">
            <h1 className="fw-bold mb-2 fs-2 display-md-4 text-white">
              {movie.title}
            </h1>

            <p className="text-danger fw-semibold fs-6 fs-md-4 mb-0 opacity-75">
              {movie.tagline}
            </p>
          </div>
        </Container>
      </div>

      <Container className="mt-n5 position-relative" style={{ zIndex: 5 }}>
        <Row className="g-4">
          <Col
            lg={4}
            md={5}
            xs={12}
            className="animate__animated animate__fadeInLeft"
          >
            <div className="movie-poster-wrapper shadow-lg mb-4">
              <img
                src={
                  movie.poster_path
                    ? `${POSTER_BASE}${movie.poster_path}`
                    : "via.placeholder.com"
                }
                alt={movie.title}
                className="img-fluid rounded-4 border border-secondary border-opacity-25"
              />
            </div>
            <div className="bg-dark bg-opacity-50 p-4 rounded-4 border border-secondary border-opacity-10">
              <div className="mb-3">
                <small className="text-secondary d-block mb-1">BUDGET</small>
                <p className="mb-0">
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "—"}
                </p>
              </div>
              <div className="mb-3">
                <small className="text-secondary d-block mb-1">REVENUE</small>
                <p className="mb-0 text-success">
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "—"}
                </p>
              </div>
              <div>
                <small className="text-secondary d-block mb-1">STATUS</small>
                <Badge bg="danger" className="rounded-pill">
                  {movie.status}
                </Badge>
              </div>
            </div>
          </Col>

          <Col
            lg={8}
            xs={12}
            md={7}
            className="animate__animated animate__fadeIn"
          >
            <div className="d-flex flex-wrap gap-2 mb-4">
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                ⭐ {movie.vote_average.toFixed(1)}
              </Badge>
              <Badge
                bg="dark"
                className="border border-secondary px-3 py-2 fs-6"
              >
                {new Date(movie.release_date).getFullYear()}
              </Badge>
              <Badge
                bg="dark"
                className="border border-secondary px-3 py-2 fs-6"
              >
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </Badge>
              {movie.genres?.map((genre) => (
                <Badge
                  key={genre.id}
                  bg="outline-danger"
                  className="border border-danger px-3 py-2 fs-6"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            <h3 className="fw-bold mb-3 border-bottom border-danger d-inline-block pb-1">
              Overview
            </h3>
            <p
              className="fs-5 text-secondary mb-5"
              style={{ lineHeight: "1.8" }}
            >
              {movie.overview}
            </p>

            {director && (
              <div className="mb-5">
                <h5 className="text-danger mb-1">Director</h5>
                <p className="fs-4 fw-light">{director.name}</p>
              </div>
            )}

            {topCast.length > 0 && (
              <div className="mt-5">
                <h3 className="fw-bold mb-4">Top Billed Cast</h3>
                <Row className="g-3">
                  {topCast.map((actor) => (
                    <Col key={actor.id} xs={12} md={4} lg={2}>
                      <div className="text-center cast-card">
                        <div
                          className="overflow-hidden rounded-circle mb-3 mx-auto"
                          style={{ width: "100px", height: "100px" }}
                        >
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                : "https://via.placeholder.com/100"
                            }
                            alt={actor.name}
                            className="img-fluid h-100 w-100 object-fit-cover hover-zoom"
                          />
                        </div>
                        <p className="mb-0 fw-bold small text-white text-truncate">
                          {actor.name}
                        </p>
                        <p
                          className="mb-0 text-secondary x-small text-truncate"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {actor.character}
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MovieDetails;
