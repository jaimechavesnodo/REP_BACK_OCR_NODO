import { IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  phone: string;

  @IsString()
  numberDocument: string;

  @IsString()
  typeDocument: string;

  @IsString()
  email: string;

  @IsString()
  city: string;
}
