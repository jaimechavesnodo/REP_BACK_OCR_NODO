import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateClientDto {
    @IsOptional()
    @IsString()
    phone: string;
  
    @IsOptional()
    @IsNumber()
    opportunities: number;
  
    @IsOptional()
    @IsNumber()
    totalPurchased: number;
  
    @IsOptional()
    @IsNumber()
    balanceReserve: number;
}
