import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  family_id: number;

  @Column()
  creator_id: number;

  @Column({ length: 100 })
  title: string;

  @Column()
  start_datetime: string;

  @Column({ nullable: true })
  end_datetime: string | null;

  @Column({ nullable: true })
  reminder_datetime: string | null;

  @Column()
  created_at: string;
}