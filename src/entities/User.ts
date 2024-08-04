import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { Pet } from './Pet';

export const role = {
  admin: 'admin',
  user: 'user',
  moderator: 'moderator',
} as const;

type UserRole = (typeof role)[keyof typeof role];

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'enum', enum: role, default: role.user })
  role: UserRole;

  @OneToMany(() => Pet, p => p.creator)
  pets: Pet[];
}
