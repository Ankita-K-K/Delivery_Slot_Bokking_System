import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateSlot from "./pages/CreateSlot";
import Bookings from "./pages/Bookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="slots" element={<CreateSlot />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
