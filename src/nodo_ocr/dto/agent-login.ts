import { IsString, IsNotEmpty } from 'class-validator';

export class AgentLoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}