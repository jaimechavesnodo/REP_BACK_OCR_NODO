import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../entities/agent.entity';
import { AgentCreateDto } from '../dto/create-user';
@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  findAll(): Promise<Agent[]> {
    return this.agentRepository.find();
  }

  findOne(id: number): Promise<Agent> {
    return this.agentRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.agentRepository.delete(id);
  }

  async create(userCreateDto: AgentCreateDto): Promise<Agent> {
    const newUser = this.agentRepository.create(userCreateDto);
    return this.agentRepository.save(newUser);
  }

  async findByEmail(agentEmail: string): Promise<Agent | undefined> {
    return this.agentRepository.findOneBy({agentEmail});
  }

  async update(id: number, updateData: Partial<Agent>): Promise<Agent> {
    await this.agentRepository.update(id, updateData);
    return this.agentRepository.findOneBy({ id });
  }

}
