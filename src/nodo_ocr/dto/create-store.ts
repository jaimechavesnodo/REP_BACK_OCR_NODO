import { IsString } from 'class-validator';

export class CreateStoreDto {

  @IsString()
  nameStore: string;

  @IsString()
  nit: string;

}
