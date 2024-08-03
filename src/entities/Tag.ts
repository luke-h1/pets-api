/* eslint-disable import/no-cycle */
import {
  Collection,
  Entity,
  ManyToMany,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from './BaseEntity';
import { Pet } from './Pet';

@Entity()
export class Tag extends BaseEntity {
  @Property()
  name: string;

  @ManyToMany(() => Pet, p => p.tags)
  pets = new Collection<Pet>(this);

  constructor(name: string) {
    super();
    this.name = name;
  }
}
