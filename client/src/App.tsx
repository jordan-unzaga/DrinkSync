import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DrinkPage } from './pages/DrinkPage';
import DrinkDetail from './pages/DrinkDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DrinkPage />}/>
        <Route path="/drink/:id" element={<DrinkDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
