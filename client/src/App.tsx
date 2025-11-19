import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DrinkPage } from './pages/DrinkPage';
import DrinkDetails from './pages/DrinkDetails';

function App() {
  return (
    <BrowserRouter basename="/~w62q346/finalproject/drink-sync/client/build">
      <Routes>
        <Route path="/" element={<DrinkPage />}/>
        <Route path="/drink/:id" element={<DrinkDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
