import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdatetaeShoppingClientDto {
  
    @IsOptional()
    @IsNumber()
    idClient: number;
  
    @IsOptional()
    @IsNumber()
    price: number;
  
    @IsOptional()
    @IsString()
    nit: string;
  
    @IsOptional()
    @IsString()
    invoiceUrl: string;
  
    @IsOptional()
    @IsString()
    typeProduct: string;
  
    @IsOptional()
    @IsString()
    invoiceNumber: string;
  
    @IsOptional()
    @IsString()
    dateInvoice: string;
  
    @IsOptional()
    @IsString()
    date: Date;
  
    @IsOptional()
    @IsNumber()
    invoiceRead: number;
  
    @IsOptional()
    @IsNumber()
    idAgent: number;

    @IsOptional()
    @IsNumber()
    statusInvoice: number;
  }
  
  