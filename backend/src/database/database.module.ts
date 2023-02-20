import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from 'src/administrators/entities/administrator.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';
import { Pharmacy } from 'src/pharmacies/entities/pharmacy.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'medhub',
      entities: [ 
        Medicine, 
        Pharmacy, 
        Employee,
        Administrator,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}