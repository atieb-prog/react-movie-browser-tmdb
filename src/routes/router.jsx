import { createBrowserRouter } from "react-router-dom";
import Routepath from "@routes/routes.js";
import App from "../App.jsx";
import HomePage from "@features/homePage.jsx";
import MovieDetails from "@features/movieDetails.jsx";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                path: Routepath.HOME,
                element: <HomePage/>
            },
            {
                path: Routepath.MOVIE_DETAILS,
                element: <MovieDetails/>
            },
        ]
    },
]);
export default router;