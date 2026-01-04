import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast'; // 👈 1. Import Toast
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    title: '',
    origin: '',
    destination: '',
    price: '',
    totalSeats: '40', // ค่าเริ่มต้น
    departureTime: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // 👇 2. เริ่ม Loading Toast
    const loadingToast = toast.loading('กำลังสร้างเที่ยวรถ...');

    try {
      await api.post('/trips', {
        ...formData,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        departureTime: new Date(formData.departureTime).toISOString(),
        bookedSeats: 0
      });
      
      // ✅ สร้างสำเร็จ
      toast.success('สร้างเที่ยวรถสำเร็จ! 🎉', { id: loadingToast });
      
      // เคลียร์ฟอร์ม
      setFormDefault();
    } catch (error) {
      // ❌ เกิดข้อผิดพลาด
      toast.error('สร้างไม่สำเร็จ! (เช็คสิทธิ์ Admin หรือ Token)', { id: loadingToast });
      console.error(error);
    }
  };

  const setFormDefault = () => {
    setFormData({
        title: '',
        origin: '',
        destination: '',
        price: '',
        totalSeats: '40',
        departureTime: ''
    });
  }

  // สไตล์ Input ที่ใช้ซ้ำๆ
  const inputStyle = {
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #cbd5e1', 
    boxSizing: 'border-box' as const,
    fontSize: '16px',
    marginBottom: '8px'
  };

  const labelStyle = {
    display: 'block', 
    marginBottom: '6px', 
    fontWeight: '600', 
    color: '#475569',
    fontSize: '14px'
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '700px', margin: '0 auto', fontFamily: '"Inter", "Sarabun", sans-serif' }}>
      
      {/* ปุ่มย้อนกลับ */}
      <button 
        onClick={() => navigate('/trips')} 
        style={{ 
            marginBottom: '24px', 
            cursor: 'pointer', 
            padding: '10px 16px', 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px', 
            background: 'white',
            fontWeight: '600',
            color: '#475569',
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
        }}
      >
        ⬅️ กลับไปหน้าหลัก
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', color: '#1e293b', margin: 0 }}>👮‍♂️ Admin Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: '8px' }}>เพิ่มเที่ยวรถไฟใหม่เข้าสู่ระบบ</p>
      </div>
      
      {/* การ์ดฟอร์ม */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '32px', 
        borderRadius: '20px', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          
          <div>
            <label style={labelStyle}>ชื่อขบวนรถ</label>
            <input name="title" placeholder="เช่น ด่วนพิเศษ CNX-99" value={formData.title} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
                <label style={labelStyle}>📍 ต้นทาง</label>
                <input name="origin" placeholder="กรุงเทพ" value={formData.origin} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>🏁 ปลายทาง</label>
                <input name="destination" placeholder="เชียงใหม่" value={formData.destination} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
                <label style={labelStyle}>💵 ราคา (บาท)</label>
                <input type="number" name="price" placeholder="1500" value={formData.price} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>💺 จำนวนที่นั่ง</label>
                <input type="number" name="totalSeats" placeholder="60" value={formData.totalSeats} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>📅 วันและเวลาออกเดินทาง</label>
            <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} required style={inputStyle} />
          </div>

          <button 
            type="submit" 
            style={{ 
                marginTop: '16px', 
                padding: '14px', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontWeight: 'bold',
                borderRadius: '10px',
                transition: 'background 0.2s'
            }}
          >
            ➕ ยืนยันการสร้างเที่ยวรถ
          </button>
        </form>
      </div>
    </div>
  );
}