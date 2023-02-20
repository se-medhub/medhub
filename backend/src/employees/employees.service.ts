import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { PharmaciesService } from 'src/pharmacies/pharmacies.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeCredentialsDto } from './dto/employee-credentials.dto';
import { Employee } from './entities/employee.entity';
import { EmployeeJwtPayload } from './jwt/jwt-payload.interface';
import { Pharmacy } from 'src/pharmacies/entities/pharmacy.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private jwtService: JwtService,
    private pharmaciesService: PharmaciesService,
  ) { }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeesRepository.find();
  }

  async signUp(
    createEmployeeDto: CreateEmployeeDto
    ): Promise<void> {
    const employee: Employee = new Employee();
    
    
    employee.pharmacy = await this.pharmaciesService.getpharmacyById(createEmployeeDto.pharmacyId);
    if (!employee.pharmacy) {
      throw new NotFoundException(`A pharmacy by that ID doesn't exist`);
    }
    
    employee.name = createEmployeeDto.name;
    employee.role = createEmployeeDto.role;
    employee.salt = await bcrypt.genSalt();
    employee.username = createEmployeeDto.username;
    employee.password = await this.hashPassword(createEmployeeDto.password, employee.salt);

    try {
      await this.employeesRepository.save(employee);
    } catch (error) {
      if (error.code == "23505") {
        throw new ConflictException(`User with the username ${employee.username} already exists. Pick another username.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    employeeCredentialsDto: EmployeeCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password, pharmacyId } = employeeCredentialsDto;

    const employee: Employee = await this.employeesRepository.findOne({ where: { username } });
    const pharmacy: Pharmacy = await this.pharmaciesService.getpharmacyById( pharmacyId );

    if ( employee && pharmacy ) {
      if (! await employee.checkPassword( password )) {
        throw new UnauthorizedException(`The password entered is not right.`);
      }

      if (! await employee.checkPharmacy( pharmacy )) {
        throw new UnauthorizedException(`The given employee doesn't work at the said pharmacy.`)
      }

      const payload: EmployeeJwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(`That employee doesn't exist.`);
    }
  }

  async hashPassword(password: string, salt: string) {
    return await bcrypt.hash( password, salt );
  }
}
