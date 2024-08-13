import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { CreateStoreDto } from '../dto/create-store'; 
import { Store } from '../entities/store.entity';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

  @Post()
  create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeService.create(createStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.storeService.remove(+id);
  }

  @Get()
  findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

}

