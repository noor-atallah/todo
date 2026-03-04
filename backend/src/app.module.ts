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
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: { rejectUnauthorized: false },
      logging: true,
    }),
    TodoModule,
    AuthModule,
    MailModule,
    CronModule,
  ],
})
export class AppModule {}