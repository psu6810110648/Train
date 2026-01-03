import axios from 'axios';

// ตั้งค่า URL หลักของ Backend (เช็ค Port ดีๆ นะครับ ของคุณคือ 3005)
const api = axios.create({
  baseURL: 'http://localhost:3005', 
});

// ฟังก์ชันสำหรับดึง Token มาแนบไปกับทุก Request (Interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // เดี๋ยวเราจะเก็บ Token ไว้ในนี้
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;