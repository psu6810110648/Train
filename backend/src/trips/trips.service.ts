import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  // 1. ฟังก์ชันสร้างเที่ยวรถใหม่ (เหมือนเดิม)
  async create(data: any) {
    const trip = this.tripsRepository.create(data);
    return await this.tripsRepository.save(trip);
  }

  // 2. ฟังก์ชันดึงข้อมูลเที่ยวรถทั้งหมด (แก้ไขให้รองรับการค้นหา)
  async findAll(origin?: string, destination?: string, date?: string) {
    // สร้าง QueryBuilder เพื่อให้เราเขียนเงื่อนไข SQL ได้ยืดหยุ่นขึ้น
    const query = this.tripsRepository.createQueryBuilder('trip');

    // ถ้ามีการส่ง 'origin' มา ให้ค้นหาแบบ ILIKE (ไม่สนตัวพิมพ์เล็ก-ใหญ่)
    if (origin) {
      query.andWhere('trip.origin ILIKE :origin', { origin: `%${origin}%` });
    }

    // ถ้ามีการส่ง 'destination' มา
    if (destination) {
      query.andWhere('trip.destination ILIKE :destination', { destination: `%${destination}%` });
    }

    // ถ้ามีการส่ง 'date' มา (เช่น '2026-01-05')
    if (date) {
      // แปลงเวลาใน DB เป็นข้อความ แล้วเช็คว่าขึ้นต้นด้วยวันที่ที่ส่งมาไหม
      query.andWhere('trip.departureTime::text LIKE :date', { date: `${date}%` });
    }

    // สั่งให้ดึงข้อมูลออกมา
    return await query.getMany();
  }
}