import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Todo } from '../todo/todo.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private mailService: MailService,
  ) {}

//   @Cron('* * * * *') 
//   async sendDailySummaries() {
//     console.log('⏰ Running cron job - sending summaries...');

//     const users = await this.userRepository.find();

//     for (const user of users) {
//       const todos = await this.todoRepository.find({ where: { userId: user.id } });
//       if (todos.length === 0) continue;

//       try {
//         await this.mailService.sendDailySummary(user.email, user.name || 'there', todos);
//         console.log(`✅ Summary sent to ${user.email}`);
//       } catch (err) {
//         console.error(`❌ Failed to send to ${user.email}:`, err.message);
//       }
//     }
//   }
}