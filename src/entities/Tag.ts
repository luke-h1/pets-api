/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from './Pet';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;

  @Column()
  name: string;

  @ManyToOne(() => Pet, p => p.tags)
  @JoinTable()
  pets: Pet[];
}
