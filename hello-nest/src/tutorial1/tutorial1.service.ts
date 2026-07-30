import { Injectable } from '@nestjs/common';
import { CreateTutorial1Dto } from './dto/create-tutorial1.dto';
import { UpdateTutorial1Dto } from './dto/update-tutorial1.dto';

@Injectable()
export class Tutorial1Service {

  hello():string{
    return "hello world";
  }
  create(createTutorial1Dto: CreateTutorial1Dto) {
    return 'This action adds a new tutorial1';
  }

  findAll() {
    return `This action returns all tutorial1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tutorial1`;
  }

  update(id: number, updateTutorial1Dto: UpdateTutorial1Dto) {
    return `This action updates a #${id} tutorial1`;
  }

  remove(id: number) {
    return `This action removes a #${id} tutorial1`;
  }
}
