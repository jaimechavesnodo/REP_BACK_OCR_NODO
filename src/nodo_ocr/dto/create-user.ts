import { IsString,IsNotEmpty,IsNumber } from 'class-validator';

export class AgentCreateDto {
  @IsString()
  @IsNotEmpty()
  agentEmail: string;

  @IsString()
  @IsNotEmpty()
  agentPassword: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  typeUser: number;
}