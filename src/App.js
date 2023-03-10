import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AddEditUser from "./pages/AddEditUser";
import NavBar from "./components/NavBar";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/add" element={<AddEditUser />} /> 
          <Route path="/update/:id" element={<AddEditUser />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
