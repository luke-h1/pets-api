import {
  Cascade,
  Collection,
  Entity,
  Enum,
  OneToMany,
  Property,
} from '@mikro-orm/postgresql';
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
  @Property({ type: 'text' })
  firstName: string;

  @Property({ type: 'text' })
  lastName: string;

  @Property({ type: 'text', unique: true })
  email: string;

  @Property({ type: 'text' })
  password: string;

  @Enum(() => role)
  role: UserRole = role.user;

  @OneToMany(() => Pet, p => p.creator, { cascade: [Cascade.ALL] })
  pets = new Collection<Pet>(this);

  @Property({ persist: false })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
