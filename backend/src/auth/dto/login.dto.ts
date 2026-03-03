import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginDto {
  @ApiProperty({ example: 'noor@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
   @IsString()
   @IsNotEmpty()
  password: string;
}