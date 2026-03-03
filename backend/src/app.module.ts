import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CronModule } from './cron/cron.module';
import { Todo } from './todo/todo.entity';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'db',
      port: 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'tododb',
      entities: [Todo, User],
      synchronize: false,
      migrationsRun: true, 
    }),
    TodoModule,
    AuthModule,
    MailModule,
    CronModule,
  ],
})
export class AppModule {}
// do migration 
// integration with any email services wherever the task is done send an email to the user 
// cron job to scheduale in a day once to see the task that are done and send a summery email 
// for local purposes send every 1 minute
// do jwt auth
// hot reload issue fix in docker

// paging to a list tasks of more than 100 lists 
// testing all points of the system command in pakage.json so that it makes tests and make sure everything is runing 
// ci/cd 