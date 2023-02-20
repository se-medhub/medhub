import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PharmaciesModule } from 'src/pharmacies/pharmacies.module';
import { AdministratorsService } from './administrators.service';
import { AdministratorsController } from './administrators.controller';
import { Administrator } from './entities/administrator.entity';
import { AdministratorJwtStrategy } from './jwt/jwt.strategy';

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
    TypeOrmModule.forFeature([ Administrator ]),
    PharmaciesModule
  ],
  providers: [
    AdministratorsService, 
    AdministratorJwtStrategy,
  ],
  controllers: [AdministratorsController],
  exports: [AdministratorJwtStrategy, PassportModule],
})
export class AdministratorsModule {}
