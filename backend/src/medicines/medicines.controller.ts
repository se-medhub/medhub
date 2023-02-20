import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';
import { Medicine } from './entities/medicine.entity';
import { Pharmacy } from 'src/pharmacies/entities/pharmacy.entity';
import { EmployeeJwtAuthGuard } from 'src/employees//jwt/jwt-auth.guard';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  /**
   * Gets all medicines matching the filtering criteria.
   * 
   * @param filterDto the filtering string.
   * @throws {NotFoundException} If no medicines that match the criteria were found.
   * @returns A promise that resolves to a list of medicines.
   */
  @Get()
  async getMedicines(@Query() filterDto: GetMedicinesFilterDto): Promise<Medicine[]>{
    // If no filtering string was provided, return all medicines. Else, return the filtered medicines.
    if (!Object.keys(filterDto).length) {
      return this.medicinesService.getAllMedicines();
    }

    return this.medicinesService.getFilteredMedicines(filterDto);
  }

  /**
   * Gets the medicine with the given ID.
   * 
   * @param id The id of the medicine needed.
   * @throws {NotFoundException} if the medicine with the given ID was not found.
   * @returns A promise that resolves to a medicine.
   */
  @Get('/:id')
  async getMedicineByIdSorted(
    @Param('id') id: number, 
    @Query('latitude') latitude: number, 
    @Query('longitude') longitude: number
    ): Promise<Medicine> {

    const medicine: Medicine = await this.medicinesService.getMedicineByIdSorted(id, { latitude, longitude });

    console.log(medicine.pharmacies);
    
    return medicine;
  }

  /**
   * Gets the medicine with the given ID.
   * 
   * @param id The id of the medicine needed.
   * @throws {NotFoundException} if the medicine with the given ID was not found.
   * @returns A promise that resolves to a medicine.
   */
  @Get('/:id')
  async getMedicineById(@Param('id') id: number): Promise<Medicine> {
    const medicine: Medicine = await this.medicinesService.getMedicineById(id);

    console.log(medicine.pharmacies);
    
    return medicine;
  }

  /**
   * Adds a new medicine to the database.
   * 
   * @param createMedicineDto The data for the new medicine.
   * @returns A promise that resolves to the newly created medicine.
   */
  @Post()
  @UseGuards(EmployeeJwtAuthGuard)
  async createMedicine(
    @Body() createMedicineDto: CreateMedicineDto,
    ): Promise<Medicine> {
    const pharmacy = new Pharmacy();
    return await this.medicinesService.createMedicine(createMedicineDto, pharmacy);
  }

}