import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('กำลังสร้างบัญชี...');

    try {
      await api.post('/auth/register', { username, password });
      toast.success('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', { id: loadingToast });
      navigate('/login');
    } catch (error) {
      toast.error('สมัครไม่สำเร็จ (ชื่อผู้ใช้อาจซ้ำ)', { id: loadingToast });
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc', 
      fontFamily: '"Inter", "Sarabun", sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '40px', 
        backgroundColor: '#ffffff', 
        borderRadius: '20px', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: '800' }}>สร้างบัญชีใหม่</h1>
          <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>ลงทะเบียนเพื่อเริ่มต้นการจองตั๋วรถไฟ</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Username</label>
            <input 
              type="text" placeholder="ตั้งชื่อผู้ใช้งาน" value={username} onChange={(e) => setUsername(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Password</label>
            <input 
              type="password" placeholder="ตั้งรหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <button type="submit" style={{ marginTop: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>
            ยืนยันการสมัคร
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            มีบัญชีอยู่แล้ว? <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/login')}>เข้าสู่ระบบ</span>
          </p>
        </div>
      </div>
    </div>
  );
}