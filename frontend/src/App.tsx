import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 1. Import Toaster เข้ามา
import Login from './pages/Login';
import Trips from './pages/Trips';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      {/* 2. วาง Toaster ไว้บนสุด เพื่อให้แจ้งเตือนลอยอยู่เหนือทุกหน้าจอ */}
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          // ตั้งค่าสไตล์พื้นฐานให้เข้ากับโทน Slate & Blue ของเรา
          style: {
            fontFamily: '"Inter", "Sarabun", sans-serif',
            borderRadius: '12px',
            background: '#1e293b',
            color: '#fff',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* หน้าหลักและหน้า Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        
        {/* หน้าจองตั๋วและประวัติ */}
        <Route path="/trips" element={<Trips />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        
        {/* ส่วนของผู้ดูแลระบบ */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;