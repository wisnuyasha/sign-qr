import MainPage from "./pages/MainPage"
import VerifyPage from "./pages/VerifyPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path={"/"} element={<MainPage />} />
            <Route path={"/verify/:id"} element={<VerifyPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}
