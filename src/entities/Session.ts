import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  token: string;

  @Column()
  user_id: number;

  @Column({ type: 'bigint' })
  expires: number;
}