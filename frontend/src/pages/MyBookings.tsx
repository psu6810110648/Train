import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

// 👇 1. อัปเดต Interface ให้รู้จัก tickets และ seatNumber
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
  tickets: { 
    id: number;
    seatNumber: string; 
  }[];
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (!confirm('⚠️ ยืนยันการยกเลิกตั๋วใช่ไหม? (ที่นั่งจะหลุดทันที)')) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      alert('ยกเลิกตั๋วเรียบร้อยแล้ว ✅');
      fetchMyBookings();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการยกเลิก');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/trips')} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}>
        ⬅️ กลับไปหน้าจองตั๋ว
      </button>

      <h1>🎫 ตั๋วของฉัน (My History)</h1>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {bookings.length === 0 ? <p style={{ color: '#666' }}>ยังไม่มีประวัติการจอง...</p> : null}

        {bookings.map((item) => (
          <div key={item.id} style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            borderRadius: '8px', 
            background: 'white',
            color: 'black',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>🚆 {item.trip.title}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px' }}>
                <div>
                    <p style={{ margin: '5px 0' }}><strong>เส้นทาง:</strong> {item.trip.origin} ➡️ {item.trip.destination}</p>
                    <p style={{ margin: '5px 0' }}><strong>วันที่จอง:</strong> {new Date(item.bookingDate).toLocaleString()}</p>
                    
                    {/* 👇👇👇 2. เพิ่มส่วนแสดงเลขที่นั่ง ตรงนี้! 👇👇👇 */}
                    <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', display: 'inline-block' }}>
                        <strong>💺 เลขที่นั่งของคุณ: </strong> 
                        <span style={{ color: '#d63384', fontWeight: 'bold', fontSize: '1.1em' }}>
                            {item.tickets && item.tickets.length > 0 ? item.tickets[0].seatNumber : 'กำลังจัดสรร...'}
                        </span>
                    </div>
                    {/* 👆👆👆 จบส่วนแสดงเลขที่นั่ง 👆👆👆 */}

                    <p style={{ margin: '10px 0 0 0', color: 'green', fontWeight: 'bold' }}>สถานะ: จองสำเร็จ ✅</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button 
                        onClick={() => handleCancel(item.id)}
                        style={{
                            backgroundColor: '#dc3545', color: 'white', border: 'none',
                            padding: '10px 15px', borderRadius: '5px', cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        ❌ ยกเลิกตั๋ว
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}