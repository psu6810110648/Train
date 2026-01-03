import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Trips from './pages/Trips';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard'; // 1. import เข้ามา

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* 2. เพิ่ม Route นี้ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;