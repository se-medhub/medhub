import { Module } from '@nestjs/common';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { DatabaseModule } from './database/database.module';
import { MedicinesModule } from './medicines/medicines.module';
import { PassportModule } from '@nestjs/passport';
import { EmployeesModule } from './employees/employees.module';
import { AdministratorsModule } from './administrators/administrators.module';

@Module({
  imports: [ 
    MedicinesModule, 
    DatabaseModule, 
    PharmaciesModule, 
    PassportModule,
    EmployeesModule,
    AdministratorsModule
  ],
})
export class AppModule {}
