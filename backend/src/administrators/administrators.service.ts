import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Administrator } from './entities/administrator.entity';
import { PharmaciesService } from 'src/pharmacies/pharmacies.service';
import { AdministratorCredentialsDto } from './dto/administrator-credentials.dto';
import { AdministratorJwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AdministratorsService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    private jwtService: JwtService,
    private pharmaciesService: PharmaciesService,
  ) { }

  async getAllEmployees(): Promise<Administrator[]> {
    return await this.administratorRepository.find();
  }

  async signUp(
    administratorCredentialsDto: AdministratorCredentialsDto
    ): Promise<void> {
    const administrator: Administrator = new Administrator();
    
    administrator.salt = await bcrypt.genSalt();
    administrator.username = administratorCredentialsDto.username;
    administrator.password = await this.hashPassword(administratorCredentialsDto.password, administrator.salt);

    try {
      await this.administratorRepository.save(administrator);
    } catch (error) {
      console.log(error.code);
      if (error.code == "23505") {
        throw new ConflictException(`User with the username ${administrator.username} already exists. Pick another username.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    administratorCredentialsDto: AdministratorCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = administratorCredentialsDto;

    const administrator: Administrator = await this.administratorRepository.findOne({ where: { username } });

    if ( administrator ) {
      if (! await administrator.checkPassword( password )) {
        throw new UnauthorizedException(`The password entered is not right.`);
      }

      const payload: AdministratorJwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(`That administrator doesn't exist.`);
    }
  }

  async hashPassword(password: string, salt: string) {
    return await bcrypt.hash( password, salt );
  }
}
