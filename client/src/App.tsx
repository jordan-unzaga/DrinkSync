import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DrinkPage } from "./pages/DrinkPage";
import DrinkDetail from "./pages/DrinkDetail";
import AboutPage from "./pages/AboutPage";

function App() {
    return (
        <BrowserRouter basename="/~w62q346/finalproject/drink-sync/client/build">
            <Routes>
                <Route path="/" element={<DrinkPage />} />
                <Route path="/drink/:id" element={<DrinkDetail />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
