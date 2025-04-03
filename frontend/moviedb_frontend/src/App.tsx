import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Movies from "./components/Movies";
import MovieDetails from "./components/Moviedetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
