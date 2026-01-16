import { tmdb } from "@/hooks/useAxios";

// Popular movies
export const getPopularMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/popular", { params: { page } });
  return res.data;
};
// Top-rated movies
export const getTopRatedMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/top_rated", { params: { page } });
  return res.data;
};
// Upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/upcoming", { params: { page } });
  return res.data;
};
// Now playing movies
export const getNowPlayingMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/now_playing", { params: { page } });
  return res.data;
};
//trending movies
export const getTrendingMovies = async (time_window = 'week', page = 1) => {
  const res = await tmdb.get(`/trending/movie/${time_window}`, { params: { page } });
  return res.data;
};

// Search movies
export const searchMovies = async (query, page = 1) => {
  const res = await tmdb.get("/search/movie", { params: { query, page } });
  return res.data;
};

// Movie details
export const getMovieDetails = async (id) => {
  const res = await tmdb.get(`/movie/${id}`);
  return res.data;
};

// Movie credits
export const getMovieCredits = async (id) => {
  const res = await tmdb.get(`/movie/${id}/credits`);
  return res.data;
};