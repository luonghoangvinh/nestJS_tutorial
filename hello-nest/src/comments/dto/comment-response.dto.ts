export class CommentResponseDto {
    id!: number;
    userId!: number;
    articleId!: number;
    comment!: string;
    createdAt!: Date;
    constructor(comment: any) {
        this.id = comment.id!;
        this.userId = comment.userId;
        this.articleId = comment.articleId;
        this.comment = comment.comment;
        this.createdAt = comment.createdAt;
    }
}