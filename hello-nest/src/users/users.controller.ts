import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  BadRequestException,
  Res,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { extname } from 'node:path/win32';
import { randomUUID } from 'node:crypto';
import { diskStorage } from 'multer';
import type { Response } from 'express';

const CACHE_CONTROL_HEADER = 'Cache-Control';
const NO_STORE_CACHE_CONTROL = 'no-store, no-cache, must-revalidate';
const PRAGMA_HEADER = 'Pragma';
const NO_CACHE_HEADER_VALUE = 'no-cache';
const EXPIRES_HEADER = 'Expires';
const EXPIRED_HEADER_VALUE = '0';
export function antiCacheHeaders(response: Response): void {
  response.setHeader(CACHE_CONTROL_HEADER, NO_STORE_CACHE_CONTROL);
  response.setHeader(PRAGMA_HEADER, NO_CACHE_HEADER_VALUE);
  response.setHeader(EXPIRES_HEADER, EXPIRED_HEADER_VALUE);
}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Res({ passthrough: true }) res: Response) {
    antiCacheHeaders(res);
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getProfile(@Param('id') id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    antiCacheHeaders(res);
    return this.usersService.getProfile(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/uploads/avatars',
        filename: (_, file, cb) => {
          const filename = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      avatar: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})
  async updateAvatar(
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 5 * 1024 * 1024,
        }),
        new FileTypeValidator({
          fileType: /^image\/(jpeg|png|webp)$/,
        }),
      ],
    }),
    ) file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    antiCacheHeaders(res);
    if (!file) {
      throw new BadRequestException('Avatar is required');
    }

    return this.usersService.updateAvatar(req.user.id, file);
  }
}
