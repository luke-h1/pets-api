/* eslint-disable import/no-cycle */
import {
  Entity,
  Column,
  JoinTable,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Tag } from './Tag';
import { User } from './User';

const status = {
  available: 'available',
  pending: 'pending',
  adopted: 'adopted',
} as const;

type PetStatus = (typeof status)[keyof typeof status];

@Entity({ comment: 'Pets' })
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text' })
  breed: string;

  @Column({ type: 'enum', enum: status, default: status.available })
  status: PetStatus;

  @Column({ type: 'int' })
  birthYear: number;

  @Column({ type: 'text' })
  photoUrl: string;

  @OneToMany(() => Tag, t => t.pets)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => User, u => u.id)
  creator: User;
}
