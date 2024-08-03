import { PrimaryKey, Property } from '@mikro-orm/postgresql';

export abstract class BaseEntity {
  @PrimaryKey()
  id: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
