import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./components/Main/Main";
import Authentication from "./components/Authentication/Authentication";
import { Route, Routes } from "react-router-dom";
import Aos from "aos";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    Aos.init({
      once: true,
      mirror: false,
    });
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="authentication" element={<Authentication />} />
      </Routes>
    </div>
  );
}

export default App;
