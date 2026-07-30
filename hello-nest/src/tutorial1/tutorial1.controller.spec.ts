import { Test, TestingModule } from '@nestjs/testing';
import { Tutorial1Controller } from './tutorial1.controller';
import { Tutorial1Service } from './tutorial1.service';

describe('Tutorial1Controller', () => {
  let controller: Tutorial1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Tutorial1Controller],
      providers: [Tutorial1Service],
    }).compile();

    controller = module.get<Tutorial1Controller>(Tutorial1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
