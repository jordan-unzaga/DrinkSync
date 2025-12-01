import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DrinkPage } from "./pages/DrinkPage";
import DrinkDetail from "./pages/DrinkDetail";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import SavedDrinksPage from "./pages/SavedDrinksPage";

function App() {
    return (
        <BrowserRouter basename="/~w62q346/finalproject/drink-sync/client/build">
            <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/drinkpage" element={<DrinkPage />} />
                <Route path="/drink/:id" element={<DrinkDetail />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="saveddrinks" element={<SavedDrinksPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
