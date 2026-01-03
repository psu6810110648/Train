// src/types.ts

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export interface Trip {
  id: number;
  title: string;
  origin: string;
  destination: string;
  departureTime: string; // Frontend รับมาเป็น String ก่อนค่อยแปลง
  price: number;
  totalSeats: number;
  bookedSeats: number;
}

export interface Booking {
  id: number;
  bookingDate: string;
  trip: Trip; // ใบจองจะมีข้อมูลเที่ยวรถแนบมาด้วย
}

export interface LoginResponse {
  access_token: string;
}