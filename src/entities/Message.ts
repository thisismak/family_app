import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  family_id: number;

  @Column()
  sender_id: number;

  @Column({ length: 1000 })
  content: string;

  @Column()
  sent_at: string;
}