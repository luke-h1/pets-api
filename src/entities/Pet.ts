/* eslint-disable import/no-cycle */
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from './BaseEntity';
import { Tag } from './Tag';
import { User } from './User';

const status = {
  available: 'available',
  pending: 'pending',
  adopted: 'adopted',
} as const;

type PetStatus = (typeof status)[keyof typeof status];

@Entity()
export class Pet extends BaseEntity {
  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'text' })
  type: string;

  @Property({ type: 'text' })
  breed: string;

  @Enum(() => status)
  status: PetStatus;

  @Property({ type: 'int' })
  birthYear: number;

  @Property({ type: 'text' })
  photoUrl: string;

  @ManyToMany(() => Tag)
  tags = new Collection<Tag>(this);

  @ManyToOne(() => User)
  creator: User;

  constructor(
    name: string,
    type: string,
    breed: string,
    // eslint-disable-next-line no-shadow
    status: PetStatus,
    birthYear: number,
    photoUrl: string,
    creator: User,
    tags: Collection<Tag>,
  ) {
    super();
    this.name = name;
    this.type = type;
    this.breed = breed;
    this.status = status;
    this.birthYear = birthYear;
    this.photoUrl = photoUrl;
    this.creator = creator;
    this.tags = tags;
  }
}
