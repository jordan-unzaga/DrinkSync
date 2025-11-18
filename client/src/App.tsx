import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./components/Search";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <BrowserRouter basename="/~w62q346/finalproject/drink-sync/client/build">
      <Routes>
        <Route path="/" element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
