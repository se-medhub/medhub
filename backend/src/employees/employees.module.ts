import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Employee } from './entities/employee.entity';
import { PharmaciesModule } from 'src/pharmacies/pharmacies.module';
import { EmployeesController } from './employees.controller';
import { EmployeeJwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: "MedHub",
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    TypeOrmModule.forFeature([ Employee ]),
    PharmaciesModule
  ],
  providers: [
    EmployeesService, 
    EmployeeJwtStrategy,
  ],
  controllers: [EmployeesController],
  exports: [EmployeeJwtStrategy, PassportModule],
})
export class EmployeesModule {}
