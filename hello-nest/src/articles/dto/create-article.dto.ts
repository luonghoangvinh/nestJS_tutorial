import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateArticleDto {

    @IsNumber()
    @ApiProperty({
        description: 'ID người dùng',
        example: 4,
    })
    userId!: number;

    @IsString()
    @ApiProperty({
        description: 'Tiêu đề bài viết',
        example: 'Đây là tiêu đề bài viết',
    })
    title!: string;

    @IsString()
    @ApiProperty({
        description: 'Mô tả bài viết',
        example: 'Đây là mô tả bài viết',
    })
    description?: string;

    @IsString()
    @ApiProperty({
        description: 'Nội dung bài viết',
        example: 'Đây là nội dung bài viết',
    })
    content!: string;




}
