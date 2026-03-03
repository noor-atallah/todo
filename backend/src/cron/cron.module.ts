import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronService } from './cron.service';
import { User } from '../user/user.entity';
import { Todo } from '../todo/todo.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Todo]),
    MailModule,
  ],
  providers: [CronService],
})
export class CronModule {}