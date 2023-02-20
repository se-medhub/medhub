import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { EmployeeJwtAuthGuard } from 'src/employees//jwt/jwt-auth.guard';
import { GetEmployee } from 'src/employees/decorators/get-employee.decorator';
import { Employee } from 'src/employees/entities/employee.entity';
import { Pharmacy } from './entities/pharmacy.entity';
import { AdministratorJwtAuthGuard } from 'src/administrators/jwt/jwt-auth.guard';

@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

  @Post()
  @UseGuards(AdministratorJwtAuthGuard)
  create(@Body() createPharmacyDto: CreatePharmacyDto ) {
    return this.pharmaciesService.create(createPharmacyDto);
  }


  @Get(':id')
  @UseGuards(EmployeeJwtAuthGuard)
  async getpharmacyById(@Param('id') id: string, @GetEmployee() employee: Employee): Promise<Pharmacy> {
    const pharmacy = await this.pharmaciesService.getpharmacyById(+id);

    if ( !(employee) || !(employee.checkPharmacy(pharmacy)) || !(employee.role == "Owner") ) {
      throw new UnauthorizedException(`The user is not the owner of this pharmacy`);
    }

    return pharmacy;
  }

  //you can use http://localhost/pharmacies?latitude=<latitude-value>&longitude=<longitude-value>
  @Get()
  findNearestPharmacies( @Query('latitude') latitude: number,
          @Query('longitude') longitude: number,){
    return this.pharmaciesService.findNearestPharmacies(latitude,longitude);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePharmacyDto: UpdatePharmacyDto) {
    return this.pharmaciesService.update(+id, updatePharmacyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pharmaciesService.remove(id);
  }
}
