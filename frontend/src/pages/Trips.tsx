import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface Trip {
  id: number;
  title: string;
  origin: string;
  destination: string;
  departureTime: string;
  price: number;
  totalSeats: number;
  bookedSeats: number;
}

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงข้อมูลเที่ยวรถทันทีที่เข้าหน้านี้
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips');
        setTrips(res.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);

  // ฟังก์ชันกดจอง
  const handleBooking = async (tripId: number) => {
    try {
      if (!confirm('ยืนยันการจองตั๋วใช่ไหม?')) return;

      await api.post('/bookings', { tripId });
      alert('จองสำเร็จ! 🎉');

      // รีเฟรชข้อมูลใหม่ (ให้ที่นั่งลดลงทันที)
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (error) {
      alert('จองไม่สำเร็จ! (อาจจะไม่ได้ Login หรือรถเต็ม)');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>

      {/* 👇👇👇 แก้ไขส่วนหัวตรงนี้ครับ 👇👇👇 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🚆 รอบรถไฟทั้งหมด</h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* ปุ่มใหม่: ดูตั๋วของฉัน */}
          <button
            onClick={() => navigate('/my-bookings')}
            style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer' }}
          >
            🎫 ตั๋วของฉัน
          </button>

          <button
            onClick={() => navigate('/admin')}
            style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer' }}
          >
            👮‍♂️ Admin
          </button>

          {/* ปุ่มเดิม: ออกจากระบบ */}
          <button onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer' }}>
            ออกจากระบบ
          </button>
        </div>
      </div>
      {/* 👆👆👆 จบส่วนที่แก้ไข 👆👆👆 */}

      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {trips.map((trip) => (
          <div key={trip.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>{trip.title}</h2>
            <p><strong>จาก:</strong> {trip.origin} ➡️ <strong>ไป:</strong> {trip.destination}</p>
            <p><strong>ราคา:</strong> {trip.price} บาท</p>
            <p style={{ color: trip.bookedSeats >= trip.totalSeats ? 'red' : 'green' }}>
              <strong>ที่นั่งว่าง:</strong> {trip.totalSeats - trip.bookedSeats} / {trip.totalSeats}
            </p>

            <button
              onClick={() => handleBooking(trip.id)}
              disabled={trip.bookedSeats >= trip.totalSeats}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: trip.bookedSeats >= trip.totalSeats ? '#e9dfdfff' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: trip.bookedSeats >= trip.totalSeats ? 'not-allowed' : 'pointer'
              }}
            >
              {trip.bookedSeats >= trip.totalSeats ? 'เต็มแล้ว' : 'จองตั๋วใบนี้'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}