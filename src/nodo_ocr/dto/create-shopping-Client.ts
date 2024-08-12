import { IsString,IsNumber } from 'class-validator';

export class CreateShoppingClientDto {
  
  @IsNumber()
  idClient: number;

  @IsNumber()
  price: number;

  @IsString()
  nit: string;

  @IsString()
  invoiceNumber: string;

  @IsString()
  dateInvoice: string;

  @IsString()
  typeProduct: string;

  @IsString()
  invoiceUrl: string;

  @IsNumber()
  invoiceRead: number;

}
