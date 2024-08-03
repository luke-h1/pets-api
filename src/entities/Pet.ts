/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

import { BaseEntity } from './BaseEntity';
import { Tag } from './Tag';
import { User } from './User';

const status = {
  available: 'available',
  pending: 'pending',
  adopted: 'adopted',
} as const;

type PetStatus = (typeof status)[keyof typeof status];

@Entity({ comment: 'Pets' })
export class Pet extends BaseEntity {
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

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => User, u => u.id)
  creator: User;
}
