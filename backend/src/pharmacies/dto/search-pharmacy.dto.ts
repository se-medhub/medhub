import { IsNotEmpty,IsNumber } from "class-validator";

export class SearchPharmacyDto{
    @IsNumber()
    @IsNotEmpty()
    lat: number;
    
    @IsNumber()
    @IsNotEmpty()
    lng: number;
}