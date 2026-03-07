import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

// Public pages
import Home      from "./pages/Home";
import Donate    from "./pages/Donate";
import NGO       from "./pages/NGO";
import Register  from "./pages/Register";
import Login     from "./pages/Login";
import LiveMap   from "./pages/LiveMap";

// Role dashboards
import DonorDashboard     from "./pages/dashboards/DonorDashboard";
import NGODashboard       from "./pages/dashboards/NGODashboard";
import VolunteerDashboard from "./pages/dashboards/VolunteerDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<Home />} />
          <Route path="/donate"   element={<Donate />} />
          <Route path="/ngo"      element={<NGO />} />
          <Route path="/map"      element={<LiveMap />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login"    element={<Login />} />

          {/* ── Protected dashboards ── */}
          <Route path="/dashboard/donor" element={
            <PrivateRoute role="donor"><DonorDashboard /></PrivateRoute>
          } />
          <Route path="/dashboard/ngo" element={
            <PrivateRoute role="ngo"><NGODashboard /></PrivateRoute>
          } />
          <Route path="/dashboard/volunteer" element={
            <PrivateRoute role="volunteer"><VolunteerDashboard /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

