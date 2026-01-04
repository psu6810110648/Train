import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // 👈 1. เพิ่ม Import ตรงนี้

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
      toast.error('โหลดข้อมูลไม่สำเร็จ'); // แจ้งเตือนเมื่อโหลดไม่ได้
    }
  };

  // 👇 2. ปรับปรุงฟังก์ชันยกเลิกให้มี Animation สวยๆ
  const handleCancel = async (bookingId: number) => {
    // ถามยืนยันก่อน
    if (!confirm('⚠️ ยืนยันการยกเลิกตั๋วใช่ไหม? (ที่นั่งจะหลุดทันที)')) return;

    // เริ่มแสดงสถานะ Loading
    const loadingToast = toast.loading('กำลังยกเลิกตั๋ว...');

    try {
      await api.delete(`/bookings/${bookingId}`);
      
      // ✅ เปลี่ยน Loading เป็น Success
      toast.success('ยกเลิกตั๋วเรียบร้อยแล้ว', { id: loadingToast });
      
      fetchMyBookings(); // รีเฟรชรายการ
    } catch (error) {
      // ❌ เปลี่ยน Loading เป็น Error
      toast.error('เกิดข้อผิดพลาดในการยกเลิก', { id: loadingToast });
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: '"Inter", "Sarabun", sans-serif' }}>
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
        ⬅️ กลับไปหน้าจองตั๋ว
      </button>

      <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '32px' }}>🎫 ประวัติการจองของฉัน</h1>
      
      <div style={{ display: 'grid', gap: '24px' }}>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'white', borderRadius: '16px', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
            <p>ยังไม่มีประวัติการจองในระบบ</p>
          </div>
        ) : null}

        {bookings.map((item) => (
          <div key={item.id} style={{ 
            backgroundColor: 'white',
            borderRadius: '16px', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {/* ส่วนหัวของตั๋ว (Ticket Header) */}
            <div style={{ 
                padding: '24px', 
                borderBottom: '2px dashed #f1f5f9',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ margin: 0, color: '#2563eb', fontSize: '20px' }}>🚆 {item.trip.title}</h3>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                    ID: #{item.id}
                </span>
            </div>
            
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>{item.trip.origin}</span>
                            <span style={{ color: '#cbd5e1', fontWeight: 'normal' }}>→</span>
                            <span>{item.trip.destination}</span>
                        </div>
                        
                        <div style={{ color: '#475569', fontSize: '14px', display: 'grid', gap: '6px' }}>
                            <p style={{ margin: 0 }}><strong>📅 วันที่จอง:</strong> {new Date(item.bookingDate).toLocaleString('th-TH')}</p>
                            <p style={{ margin: 0 }}><strong>🕒 เวลาเดินทาง:</strong> {new Date(item.trip.departureTime).toLocaleString('th-TH', { timeStyle: 'short', dateStyle: 'short' })}</p>
                        </div>
                        
                        {/* Seat Badge */}
                        <div style={{ 
                            marginTop: '20px', 
                            padding: '10px 16px', 
                            backgroundColor: '#fdf2f8', 
                            border: '1px solid #fce7f3',
                            borderRadius: '10px', 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '18px' }}>💺</span>
                            <span style={{ color: '#64748b', fontWeight: '600', fontSize: '14px' }}>เลขที่นั่งของคุณ:</span>
                            <span style={{ color: '#db2777', fontWeight: '800', fontSize: '18px' }}>
                                {item.tickets && item.tickets.length > 0 ? item.tickets[0].seatNumber : '---'}
                            </span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#16a34a', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <span>จองสำเร็จ</span> ✅
                        </p>
                        <button 
                            onClick={() => handleCancel(item.id)}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#ef4444',
                                border: '1px solid #fecaca',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: '0.2s'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                            ยกเลิกตั๋วใบนี้
                        </button>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}