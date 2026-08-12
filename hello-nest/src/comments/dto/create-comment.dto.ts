import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {

    @ApiProperty({
        description: 'Nội dung bình luận',
        example: 'Đây là nội dung bình luận',
    })
    comment!: string;
}
