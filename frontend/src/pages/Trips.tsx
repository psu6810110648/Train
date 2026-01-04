import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import Toast Notification

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

  // State สำหรับดูว่ากำลังกดจอง ID ไหนอยู่ (เพื่อทำปุ่ม Loading)
  const [bookingId, setBookingId] = useState<number | null>(null);

  // State สำหรับการค้นหา
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
      toast.error('โหลดข้อมูลเที่ยวรถไม่สำเร็จ');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('กำลังค้นหา...'); 
    
    try {
      // ส่งค่า Query Params ไปให้ Backend กรองข้อมูล
      const res = await api.get('/trips', {
        params: {
          origin: searchOrigin,
          destination: searchDest,
          date: searchDate
        }
      });
      setTrips(res.data);
      toast.dismiss(loadingToast); // ปิด Loading เมื่อเสร็จ
      
      if (res.data.length === 0) {
        toast('ไม่พบเที่ยวรถตามเงื่อนไข', { icon: '🔍' });
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการค้นหา', { id: loadingToast });
    }
  };

  const handleBooking = async (tripId: number) => {
    if (!confirm('ยืนยันการจองตั๋วใช่ไหม?')) return;

    setBookingId(tripId); // เริ่มสถานะ Loading ปุ่มนี้
    const loadingToast = toast.loading('กำลังดำเนินการจอง...');

    try {
      await api.post('/bookings', { tripId });
      
      toast.success('จองตั๋วสำเร็จ! ขอให้สนุกกับการเดินทาง 🎉', { id: loadingToast });
      fetchTrips(); // รีเฟรชข้อมูลล่าสุด
    } catch (error) {
      toast.error('จองไม่สำเร็จ! (รถเต็มหรือยังไม่ได้ Login)', { id: loadingToast });
    } finally {
      setBookingId(null); // หยุดสถานะ Loading
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: '"Inter", "Sarabun", sans-serif' }}>
      
      {/* --- ส่วนหัว Header (มีปุ่ม Admin แล้ว) --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#1e293b' }}>🚆 ค้นหาเที่ยวรถไฟ</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>เลือกเส้นทางและเวลาที่คุณต้องการเดินทาง</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            
            {/* ปุ่ม Admin Dashboard */}
            <button 
                onClick={() => navigate('/admin')} 
                style={{ 
                    backgroundColor: '#475569', // สีเทาเข้ม
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 18px', 
                    cursor: 'pointer', 
                    borderRadius: '8px', 
                    fontWeight: '600', 
                    transition: '0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}
            >
                👮‍♂️ จัดการระบบ
            </button>

            <button onClick={() => navigate('/my-bookings')} style={{ backgroundColor: '#f1f5f9', color: '#1e293b', border: 'none', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', transition: '0.2s' }}>
                🎫 ตั๋วของฉัน
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>
                ออกจากระบบ
            </button>
        </div>
      </div>

      {/* --- ส่วนแบบฟอร์มค้นหา --- */}
      <form onSubmit={handleSearch} style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr auto', 
          gap: '15px', 
          marginBottom: '40px', 
          padding: '24px', 
          backgroundColor: '#ffffff', 
          borderRadius: '16px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
          border: '1px solid #e2e8f0', 
          alignItems: 'flex-end' 
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>📍 ต้นทาง</label>
          <input placeholder="กรุงเทพ" value={searchOrigin} onChange={(e) => setSearchOrigin(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>🏁 ปลายทาง</label>
          <input placeholder="เชียงใหม่" value={searchDest} onChange={(e) => setSearchDest(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>📅 วันที่เดินทาง</label>
          <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', height: '48px' }}>
            ค้นหา
        </button>
      </form>

      {/* --- รายการรถไฟ --- */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <span style={{ fontSize: '48px' }}>🔍</span>
            <p>ไม่พบเที่ยวรถที่คุณค้นหา โปรดลองเปลี่ยนเงื่อนไขใหม่</p>
          </div>
        ) : null}
        
        {trips.map((trip) => (
          <div key={trip.id} style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: 'white', padding: '24px', borderRadius: '16px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', transition: '0.2s ease-in-out'
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#1e293b' }}>🚆 {trip.title}</h2>
              <div style={{ display: 'flex', gap: '20px', color: '#475569', fontSize: '15px' }}>
                <span><strong>🕒 เวลา:</strong> {new Date(trip.departureTime).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}</span>
                <span><strong>📍 เส้นทาง:</strong> {trip.origin} ➡️ {trip.destination}</span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <span style={{ 
                  padding: '4px 12px', borderRadius: '99px', fontSize: '13px', fontWeight: '600',
                  backgroundColor: trip.bookedSeats >= trip.totalSeats ? '#fee2e2' : '#f0fdf4',
                  color: trip.bookedSeats >= trip.totalSeats ? '#ef4444' : '#16a34a'
                }}>
                  {trip.bookedSeats >= trip.totalSeats ? '⚠️ เต็มแล้ว' : `✅ ว่าง ${trip.totalSeats - trip.bookedSeats} ที่นั่ง`}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginLeft: '24px' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', marginBottom: '8px' }}>
                ฿{trip.price.toLocaleString()}
              </div>
              
              <button 
                onClick={() => handleBooking(trip.id)}
                disabled={trip.bookedSeats >= trip.totalSeats || bookingId === trip.id}
                style={{
                  padding: '12px 24px',
                  backgroundColor: trip.bookedSeats >= trip.totalSeats ? '#e2e8f0' : (bookingId === trip.id ? '#93c5fd' : '#2563eb'),
                  color: trip.bookedSeats >= trip.totalSeats ? '#94a3b8' : 'white',
                  border: 'none', borderRadius: '8px', fontWeight: '700', transition: '0.2s', minWidth: '120px',
                  cursor: (trip.bookedSeats >= trip.totalSeats || bookingId === trip.id) ? 'not-allowed' : 'pointer'
                }}
              >
                {bookingId === trip.id ? '⏳ กำลังจอง...' : (trip.bookedSeats >= trip.totalSeats ? 'ที่นั่งเต็ม' : 'จองตั๋ว')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}