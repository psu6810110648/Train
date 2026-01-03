import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  // เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    title: '',
    origin: '',
    destination: '',
    price: '',
    totalSeats: '',
    departureTime: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // แปลงข้อมูลให้ตรงกับที่ Backend ต้องการ
      await api.post('/trips', {
        ...formData,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        departureTime: new Date(formData.departureTime).toISOString()
      });
      
      alert('สร้างเที่ยวรถสำเร็จ! 🎉');
      navigate('/trips'); // สร้างเสร็จกลับไปหน้าดูรถ
    } catch (error) {
      alert('สร้างไม่สำเร็จ! (คุณอาจจะไม่ใช่ Admin หรือ Token หมดอายุ)');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>👮‍♂️ Admin Dashboard (เพิ่มเที่ยวรถ)</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        <input name="title" placeholder="ชื่อขบวน (เช่น Express 999)" onChange={handleChange} required style={{ padding: '10px' }} />
        <input name="origin" placeholder="ต้นทาง (เช่น Bangkok)" onChange={handleChange} required style={{ padding: '10px' }} />
        <input name="destination" placeholder="ปลายทาง (เช่น Hat Yai)" onChange={handleChange} required style={{ padding: '10px' }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input type="number" name="price" placeholder="ราคา (บาท)" onChange={handleChange} required style={{ padding: '10px' }} />
            <input type="number" name="totalSeats" placeholder="จำนวนที่นั่ง" onChange={handleChange} required style={{ padding: '10px' }} />
        </div>
        
        <label>เวลาออกเดินทาง:</label>
        <input type="datetime-local" name="departureTime" onChange={handleChange} required style={{ padding: '10px' }} />

        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
          ➕ สร้างเที่ยวรถใหม่
        </button>
      </form>
      
      <button onClick={() => navigate('/trips')} style={{ marginTop: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
        ❌ ยกเลิก / กลับไปหน้าหลัก
      </button>
    </div>
  );
}