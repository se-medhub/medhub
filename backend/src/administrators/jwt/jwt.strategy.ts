import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Administrator } from '../entities/administrator.entity';
import { AdministratorJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AdministratorJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: "MedHub",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: AdministratorJwtPayload): Promise<Administrator> {
    const { username } = payload;
    const user: Administrator = await this.administratorRepository.findOne({ where: { username }});

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
