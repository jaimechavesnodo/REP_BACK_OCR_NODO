import { IsString,IsNotEmpty } from 'class-validator';

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
}