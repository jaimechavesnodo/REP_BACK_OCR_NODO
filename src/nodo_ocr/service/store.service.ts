import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto } from '../dto/create-store';
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  findAll(): Promise<Store[]> {
    return this.storeRepository.find();
  }

  findOne(id: number): Promise<Store> {
    return this.storeRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.storeRepository.delete(id);
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const newUser = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(newUser);
  }

  async checkNitExists(nit: string): Promise<number> {
    const store = await this.storeRepository.findOne({ where: { nit } });
    return store ? 1 : 2;
  }


}
