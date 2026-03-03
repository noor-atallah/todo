import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from '../user/user.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async findAll(userId: number, page: number = 1, limit: number = 10) {
    const [todos, total] = await this.todoRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: todos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  create(title: string, description: string | undefined, userId: number): Promise<Todo> {
    const todo = this.todoRepository.create({ title, description, userId });
    return this.todoRepository.save(todo);
  }

  async update(id: number, dto: UpdateTodoDto): Promise<Todo> {
    const previous = await this.todoRepository.findOne({ where: { id } });
    await this.todoRepository.update(id, dto);
    const updated = await this.todoRepository.findOne({ where: { id } }) as Todo;

    if (!previous?.completed && updated.completed) {
      const user = await this.userRepository.findOne({ where: { id: updated.userId } });
      if (user) {
        this.mailService.sendTaskCompleted(user.email, user.name || 'there', updated)
          .catch(err => console.error('Mail error:', err.message));
      }
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}