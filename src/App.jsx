import { Outlet } from "react-router-dom";
import Navbar from "@components/navbar.jsx";

function App() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default App;