import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('family_member')
export class FamilyMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  family_id: number;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  role: string;
}