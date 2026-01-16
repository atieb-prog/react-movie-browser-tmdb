import { createBrowserRouter } from "react-router-dom";
import Routepath from "@routes/routes.js";
import HomePage from "@features/homePage.jsx";
import MovieDetails from "@features/movieDetails.jsx";

const router = createBrowserRouter([
    {
        path: Routepath.HOME,
        element: <HomePage/>
    },
    {
        path: Routepath.MOVIE_DETAILS,
        element: <MovieDetails/>
    },
]);
export default router;