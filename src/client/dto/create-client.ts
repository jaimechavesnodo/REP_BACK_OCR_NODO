import { IsString, IsDateString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  phone: string;
}
