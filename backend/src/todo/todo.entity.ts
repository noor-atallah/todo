import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity()
export class Todo {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Buy groceries' })
  @Column()
  title: string;

 

  @ApiProperty({ example: 'From the supermarket', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.todos, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;
}