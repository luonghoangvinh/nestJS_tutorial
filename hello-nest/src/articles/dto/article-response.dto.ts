import { ApiProperty } from "@nestjs/swagger";

export class ArticleResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    createdAt?: Date;
    
    constructor(article: any) {
        this.id = article.id;
        this.userId = article.userId;
        this.title = article.title;
        this.content = article.content;
        this.description = article.description??'';
        this.createdAt = article.createdAt;
    }
}