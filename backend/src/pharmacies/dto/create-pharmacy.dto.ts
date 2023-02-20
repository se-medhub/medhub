import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Unique } from "typeorm";

@Unique([ "pharmacyTinNo", "pharmacyName" ])
export class CreatePharmacyDto {
    @IsString()
    @IsNotEmpty()
    pharmacyName: string;

    @IsNumber()
    @IsNotEmpty()
    pharmaTinNo:number

    @IsNumber()
    @IsNotEmpty()
    branchNum:number

    @IsNumber()
    @IsNotEmpty()
    latitude: number;
    
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}
