import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto {
  @ApiProperty({ example: 'Buy groceries', required: false })
  title?: string;

  @ApiProperty({ example: 'From the supermarket', required: false })
  description?: string;

  @ApiProperty({ example: false, required: false })
  completed?: boolean;
}