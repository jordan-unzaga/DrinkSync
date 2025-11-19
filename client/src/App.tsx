import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DrinkPage } from './pages/DrinkPage';




function App() {
  return (
    <BrowserRouter basename="/~w62q346/finalproject/drink-sync/client/build">
      <Routes>
        <Route path="/" element={<DrinkPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
