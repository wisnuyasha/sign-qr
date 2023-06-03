import MainPage from "./pages/MainPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path={"/"} element={<MainPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}
