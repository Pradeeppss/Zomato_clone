import { Route, Routes } from "react-router-dom";
import Homepage from "./components/home/Homepage";
import Restaurantpage from "./components/restaurant/Restaurantpage";
import Searchpage from "./components/search/Searchpage";
import "./css/main.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search/:meal_id" element={<Searchpage />} />
        <Route path="/restaurant/:res_id" element={<Restaurantpage />} />
      </Routes>
    </>
  );
}

export default App;
