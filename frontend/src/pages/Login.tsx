import { useState } from 'react';
import api from '../api'; // เรียกใช้ axios ที่เราตั้งค่าไว้
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    try {
      // ยิง API ไปที่ Backend
      const res = await api.post('/auth/login', { username, password });
      
      // ถ้าสำเร็จ: เก็บ Token ลงเครื่อง
      localStorage.setItem('token', res.data.access_token);
      alert('Login สำเร็จ! 🎉');
      
      // เดี๋ยวเราจะทำหน้าถัดไป (Trips) แล้วค่อยให้ Redirect ไป
     navigate('/trips'); 
    } catch (error) {
      alert('Login ผิดพลาด! เช็ค Username/Password อีกทีนะ');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>🚆 Train Booking Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}