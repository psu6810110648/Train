import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Trip } from './entities/trip.entity';
import { Booking } from './entities/booking.entity';
import { Ticket } from './entities/ticket.entity';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'admin',     
      password: 'password123',
      database: 'train_ticket',
      entities: [User, Trip, Booking, Ticket], 
      synchronize: true, 
    }),
    AuthModule,
  ],
  controllers: [AdminController],
})
export class AppModule {}