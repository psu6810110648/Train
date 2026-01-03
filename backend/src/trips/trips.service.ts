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

  // 1. ฟังก์ชันสร้างเที่ยวรถใหม่ (รับข้อมูลมาแล้วบันทึก)
  async create(data: any) {
    const trip = this.tripsRepository.create(data);
    return await this.tripsRepository.save(trip);
  }

  // 2. ฟังก์ชันดึงข้อมูลเที่ยวรถทั้งหมด (เผื่อไว้ใช้ดูผลลัพธ์)
  async findAll() {
    return await this.tripsRepository.find();
  }
}