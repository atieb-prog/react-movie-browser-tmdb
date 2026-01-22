import {createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState(() => {
        const storedWatchlist = localStorage.getItem("watchlist");
        return storedWatchlist ? JSON.parse(storedWatchlist) : [];
    });

    useEffect(() => {
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }, [watchlist]);

    const addToWatchlist = (movie) => {
        setWatchlist((prevWatchlist) => {
            if (!prevWatchlist.find((item) => item.id === movie.id)) {
                return [...prevWatchlist, movie];
            }
            return prevWatchlist;
        });
    };

    const removeFromWatchlist = (movieId) => {
        setWatchlist((prevWatchlist) =>
            prevWatchlist.filter((item) => item.id !== movieId)
        );
    };

    const isInWatchlist = (movieId) => {
        return watchlist.some((item) => item.id === movieId);
    };
    return (
        <WatchlistContext.Provider
            value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
        >
            {children}
        </WatchlistContext.Provider>
    );
}

export const useWatchlist = () => {
    return useContext(WatchlistContext);
}