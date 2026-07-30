import { Test, TestingModule } from '@nestjs/testing';
import { Tutorial1Service } from './tutorial1.service';

describe('Tutorial1Service', () => {
  let service: Tutorial1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Tutorial1Service],
    }).compile();

    service = module.get<Tutorial1Service>(Tutorial1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
