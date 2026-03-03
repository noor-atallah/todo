import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Todo } from '../todo/todo.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Todo, todo => todo.user)
  todos: Todo[];
}