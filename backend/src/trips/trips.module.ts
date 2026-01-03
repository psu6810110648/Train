import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Import TypeOrm
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip } from '../entities/trip.entity'; // 2. Import Entity ของคุณ

@Module({
  imports: [TypeOrmModule.forFeature([Trip])], // 3. ลงทะเบียน Trip ตรงนี้
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}