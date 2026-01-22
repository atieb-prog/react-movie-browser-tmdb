import { tmdb } from "@/hooks/useAxios";

export const getPopularMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/popular", { params: { page } });
  return res.data;
};

export const getTopRatedMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/top_rated", { params: { page } });
  return res.data;
};

export const getUpcomingMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/upcoming", { params: { page } });
  return res.data;
};

export const getNowPlayingMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/now_playing", { params: { page } });
  return res.data;
};

export const getTrendingMovies = async (time_window = 'today', page = 1) => {
  const res = await tmdb.get(`/trending/movie/${time_window}`, { params: { page } });
  return res.data;
};


export const searchMovies = async (query, page = 1) => {
  const res = await tmdb.get("/search/movie", { params: { query, page } });
  return res.data;
};


export const getMovieDetails = async (id) => {
  const res = await tmdb.get(`/movie/${id}`);
  return res.data;
};


export const getMovieCredits = async (id) => {
  const res = await tmdb.get(`/movie/${id}/credits`);
  return res.data;
};