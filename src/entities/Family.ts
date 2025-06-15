import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('family')
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  owner_id: number;
}