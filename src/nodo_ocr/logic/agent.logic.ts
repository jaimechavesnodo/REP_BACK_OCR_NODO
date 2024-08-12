import { Injectable,UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AgentService } from '../service/agent.service';
import { AgentCreateDto } from '../dto/create-user';
import { Agent } from '../entities/agent.entity';
import { AgentLoginDto } from '../dto/agent-login';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AgentLogic {
  constructor(
    private readonly agentService: AgentService,
    private readonly jwtService: JwtService
  ) { }

  async createUser(userCreateDto: AgentCreateDto): Promise<Agent> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userCreateDto.agentPassword, salt);

    const newUserDto = {
      ...userCreateDto,
      agentPassword: hashedPassword,
    };

    return this.agentService.create(newUserDto);
  }

  async login(agentLoginDto: AgentLoginDto) {
    const agent = await this.validateAgent(agentLoginDto.email, agentLoginDto.password);
    if (!agent) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: agent.agentEmail, sub: agent.id };
    return {
      data: { access_token: this.jwtService.sign(payload),emial: agent.agentEmail,id : agent.id }  
    };
  }

  private async validateAgent(email: string, password: string): Promise<Agent | null> {
    const agent = await this.agentService.findByEmail(email);
    if (agent && await bcrypt.compare(password, agent.agentPassword)) {
      return agent;
    }
    return null;
  }
}
