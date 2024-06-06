import { IsString, IsNumber } from 'class-validator';

export class MessageClientDto {
  @IsNumber()
  urlFile: string;
}
