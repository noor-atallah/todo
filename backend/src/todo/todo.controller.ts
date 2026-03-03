import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Get todos with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.todoService.findAll(req.user.id, +page, +limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a todo' })
  create(@Body() body: CreateTodoDto, @Request() req) {
    return this.todoService.create(body.title, body.description, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update todo' })
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todoService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}