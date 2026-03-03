import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Noor' })
    @IsString()
    @IsNotEmpty()
    name: string;

  @ApiProperty({ example: 'noor@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
   @IsString()
  @MinLength(6)
  password: string;
}