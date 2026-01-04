import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // 👈 1. อย่าลืม Import Toast

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 👇 2. เริ่มแสดง Loading ...
    const loadingToast = toast.loading('กำลังตรวจสอบข้อมูล...'); 

    try {
      const res = await api.post('/auth/login', { username, password });
      
      // เก็บ Token
      localStorage.setItem('token', res.data.access_token);
      
      // ✅ 3. แจ้งเตือนสำเร็จ (อัปเดตทับ Loading เดิม)
      toast.success('เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับครับ', { id: loadingToast });
      
      // ไปหน้าจองตั๋ว
      navigate('/trips');
    } catch (error) {
      // ❌ 4. แจ้งเตือนเมื่อผิดพลาด
      toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', { id: loadingToast });
      console.error(error);
    }
  };

  // 👇👇👇 ส่วน UI ใหม่ (Professional Design) 👇👇👇
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc', // พื้นหลังสีเทาอ่อนสะอาดตา
      fontFamily: '"Inter", "Sarabun", sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '40px', 
        backgroundColor: '#ffffff', 
        borderRadius: '20px', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // เงานุ่มๆ
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚆</div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: '800' }}>Train Booking</h1>
          <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>ลงชื่อเข้าใช้งานเพื่อเริ่มจองตั๋วรถไฟ</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Username Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Username</label>
            <input 
              type="text"
              placeholder="กรอกชื่อผู้ใช้งาน" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #cbd5e1', 
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'} // เปลี่ยนสีขอบตอนคลิก
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          {/* Password Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Password</label>
            <input 
              type="password"
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #cbd5e1', 
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            style={{ 
              marginTop: '10px',
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '10px', 
              cursor: 'pointer', 
              fontWeight: '700', 
              fontSize: '16px',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Link ไป Register (เดี๋ยวเราค่อยไปทำหน้า Register ให้สวยตามทีหลัง) */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            ยังไม่มีบัญชี? <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/register')}>สมัครสมาชิก</span>
          </p>
        </div>

      </div>
    </div>
  );
}