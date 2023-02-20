import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { EmployeeJwtPayload } from './jwt-payload.interface';

@Injectable()
export class EmployeeJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: "MedHub",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: EmployeeJwtPayload): Promise<Employee> {
    const { username } = payload;
    const user: Employee = await this.employeesRepository.findOne({ where: { username }});

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
