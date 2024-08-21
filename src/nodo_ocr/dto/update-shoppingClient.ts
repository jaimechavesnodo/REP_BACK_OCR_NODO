import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

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
  @IsDate()
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

  @IsString()
  @IsOptional()
  commerce: string;
  
  @IsString()
  @IsOptional()
  reasonReject: string;

  @IsString()
  @IsOptional()
  queue: number;
}

