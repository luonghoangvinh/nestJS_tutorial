import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Tutorial1Service } from './tutorial1.service';
import { CreateTutorial1Dto } from './dto/create-tutorial1.dto';
import { UpdateTutorial1Dto } from './dto/update-tutorial1.dto';

@Controller('tutorial1')
export class Tutorial1Controller {
  constructor(private readonly tutorial1Service: Tutorial1Service) {}

  @Post()
  create(@Body() createTutorial1Dto: CreateTutorial1Dto) {
    return this.tutorial1Service.create(createTutorial1Dto);
  }

  @Get('hello')
  hello():string{
    return this.tutorial1Service.hello();
  }

  @Get()
  findAll() {
    return this.tutorial1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorial1Service.findOne(+id);
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTutorial1Dto: UpdateTutorial1Dto) {
    return this.tutorial1Service.update(+id, updateTutorial1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorial1Service.remove(+id);
  }
}
