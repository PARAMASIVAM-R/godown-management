import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import GodownDashboard from "./pages/GodownDashboard";
import PdsDashboard from "./pages/PDSDashboard";
import ProtectedRoute from "./ProtectedRoute"; // Import Protected Route
import RegisterPage from "./components/RegisterPage";
import MainPage from "./pages/MainPage";
import BarcodeGenerator from "./components/BarcodeGenerator";

function App() {
  return (
 
    <Router>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/BarcodeGenerator-page" element={<BarcodeGenerator />} />
      <Route path="/login-page" element={<LoginPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/godown-dashboard" element={<GodownDashboard />} />
      <Route path="/pds-dashboard" element={<PdsDashboard />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </Router>
  );
}

export default App;
