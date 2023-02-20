import { Module } from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';
import { PharmaciesController } from './pharmacies.controller';
import { Pharmacy } from './entities/pharmacy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[
    TypeOrmModule.forFeature([ Pharmacy ]),
    PassportModule,
  ],
  controllers: [ PharmaciesController ],
  providers: [ PharmaciesService ],
  exports: [ PharmaciesService, ]
})
export class PharmaciesModule {}
