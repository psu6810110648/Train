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

  // 👇 1. เพิ่มตัวแปรเก็บค่าที่ User พิมพ์ค้นหา
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDest, setSearchDest] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  // 👇 2. ฟังก์ชันเมื่อกดปุ่ม "ค้นหา"
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // กันหน้าเว็บรีเฟรช
    try {
      // ยิง API ไปที่ Backend พร้อมแนบข้อมูลการค้นหา (Query Params)
      const res = await api.get('/trips', {
        params: {
          origin: searchOrigin,     // ส่งต้นทาง
          destination: searchDest,  // ส่งปลายทาง
          date: searchDate          // ส่งวันที่
        }
      });
      setTrips(res.data); // อัปเดตรายการรถตามผลลัพธ์ที่ได้
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleBooking = async (tripId: number) => {
    try {
      if (!confirm('ยืนยันการจองตั๋วใช่ไหม?')) return;
      await api.post('/bookings', { tripId });
      alert('จองสำเร็จ! 🎉');
      fetchTrips(); // รีเฟรชข้อมูลหลังจอง
    } catch (error) {
      alert('จองไม่สำเร็จ! (รถเต็มหรือยังไม่ได้ Login)');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* ส่วนหัว Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🚆 รอบรถไฟทั้งหมด</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/admin')} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>
                👮‍♂️ Admin
            </button>
            <button onClick={() => navigate('/my-bookings')} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>
                🎫 ตั๋วของฉัน
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>
                ออก
            </button>
        </div>
      </div>

      {/* 👇👇👇 3. ส่วนแบบฟอร์มค้นหา (Search Bar) 👇👇👇 */}
      <form onSubmit={handleSearch} style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr auto', 
          gap: '10px', 
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
      }}>
        <input 
            placeholder="ต้นทาง (เช่น Bangkok)" 
            value={searchOrigin}
            onChange={(e) => setSearchOrigin(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
        />
        <input 
            placeholder="ปลายทาง (เช่น Chiang Mai)" 
            value={searchDest}
            onChange={(e) => setSearchDest(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
        />
        <input 
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
        />
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            🔍 ค้นหา
        </button>
      </form>
      {/* 👆👆👆 จบส่วนค้นหา 👆👆👆 */}

      <div style={{ display: 'grid', gap: '20px' }}>
        {trips.length === 0 ? <p style={{textAlign: 'center', color: '#666'}}>ไม่พบเที่ยวรถที่คุณค้นหา...</p> : null}
        
        {trips.map((trip) => (
          <div key={trip.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>{trip.title}</h2>
            <p><strong>เวลา:</strong> {new Date(trip.departureTime).toLocaleString()}</p>
            <p><strong>เส้นทาง:</strong> {trip.origin} ➡️ {trip.destination}</p>
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
                backgroundColor: trip.bookedSeats >= trip.totalSeats ? '#ccc' : '#28a745',
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