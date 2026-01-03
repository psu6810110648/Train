import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: number;
  bookingDate: string;
  trip: {
    title: string;
    origin: string;
    destination: string;
    price: number;
    departureTime: string;
  };
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchMyBookings();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/trips')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
        ⬅️ กลับไปหน้าจองตั๋ว
      </button>

      <h1>🎫 ตั๋วของฉัน (My History)</h1>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {bookings.length === 0 ? <p>ยังไม่มีประวัติการจอง...</p> : null}

        {bookings.map((item) => (
          <div key={item.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            borderRadius: '8px', 
            background: 'white',     // พื้นหลังสีขาว
            color: 'black',          // ✅ ตัวหนังสือสีดำ (อ่านง่ายแน่นอน)
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // เพิ่มเงาให้ดูเป็นการ์ดลอยขึ้นมา
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>🚆 {item.trip.title}</h3>
            <p style={{ margin: '5px 0' }}><strong>เส้นทาง:</strong> {item.trip.origin} ➡️ {item.trip.destination}</p>
            <p style={{ margin: '5px 0' }}><strong>ราคา:</strong> {item.trip.price} บาท</p>
            <p style={{ margin: '5px 0' }}><strong>วันที่จอง:</strong> {new Date(item.bookingDate).toLocaleString()}</p>
            <p style={{ margin: '10px 0 0 0', color: 'green', fontWeight: 'bold' }}>สถานะ: จองสำเร็จ ✅</p>
          </div>
        ))}
      </div>
    </div>
  );
}