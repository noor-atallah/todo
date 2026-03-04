import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'From the supermarket', required: false })
  @IsOptional()
  description?: string;
}


// use nest pagination pakage important!!!!
// ER_PARSE_ERROR  make validation to not accept ant offset with minus