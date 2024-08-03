import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';

// eslint-disable-next-line import/no-cycle
import { Pet } from './Pet';

export const role = {
  admin: 'admin',
  user: 'user',
  moderator: 'moderator',
} as const;

type UserRole = (typeof role)[keyof typeof role];

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'enum', enum: role, default: role.user })
  role: UserRole;

  @OneToMany(() => Pet, p => p.creator)
  pets: Pet[];

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
