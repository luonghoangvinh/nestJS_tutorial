import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorial1Dto } from './create-tutorial1.dto';

export class UpdateTutorial1Dto extends PartialType(CreateTutorial1Dto) {}
