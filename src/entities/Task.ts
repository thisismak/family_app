import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  family_id: number;

  @Column()
  creator_id: number;

  @Column({ nullable: true })
  assignee_id: number | null;

  @Column({ length: 255 })
  title: string;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  due_date: string | null;

  @Column({ length: 50 })
  priority: string;

  @Column({ length: 50 })
  status: string;
}