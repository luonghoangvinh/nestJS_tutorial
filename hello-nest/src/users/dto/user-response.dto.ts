import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;


    constructor(user: any) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        
    }
}