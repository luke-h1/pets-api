/* eslint-disable import/no-cycle */
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Pet } from './Pet';

@Entity()
export class Tag extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Pet, p => p.tags)
  @JoinTable()
  pets: Pet[];

  constructor(name: string) {
    super();
    this.name = name;
  }
}
