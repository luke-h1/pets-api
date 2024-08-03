import { Migration } from '@mikro-orm/migrations';

export class Migration20240731132611 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tag" ("id" varchar(255) not null, "created_at" date not null, "updated_at" date not null, "name" varchar(255) not null, constraint "tag_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "user" ("id" varchar(255) not null, "created_at" date not null, "updated_at" date not null, "first_name" text not null, "last_name" text not null, "email" text not null, "password" text not null, "role" text check ("role" in (\'admin\', \'user\', \'moderator\')) not null default \'user\', constraint "user_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );

    this.addSql(
      'create table "pet" ("id" varchar(255) not null, "created_at" date not null, "updated_at" date not null, "name" text not null, "type" text not null, "breed" text not null, "status" text check ("status" in (\'available\', \'pending\', \'adopted\')) not null, "birth_year" int not null, "photo_url" text not null, "creator_id" varchar(255) not null, constraint "pet_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "pet_tags" ("pet_id" varchar(255) not null, "tag_id" varchar(255) not null, constraint "pet_tags_pkey" primary key ("pet_id", "tag_id"));',
    );

    this.addSql(
      'alter table "pet" add constraint "pet_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "pet_tags" add constraint "pet_tags_pet_id_foreign" foreign key ("pet_id") references "pet" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "pet_tags" add constraint "pet_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;',
    );

    this.addSql('drop table if exists "Pet" cascade;');

    this.addSql('drop table if exists "_prisma_migrations" cascade;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "pet_tags" drop constraint "pet_tags_tag_id_foreign";',
    );

    this.addSql('alter table "pet" drop constraint "pet_creator_id_foreign";');

    this.addSql(
      'alter table "pet_tags" drop constraint "pet_tags_pet_id_foreign";',
    );

    this.addSql(
      'create table "Pet" ("id" serial primary key, "name" text not null, "age" int4 not null, "breed" text not null, "available" bool not null default true, "createdAt" timestamp(3) not null default CURRENT_TIMESTAMP, "updatedAt" timestamp(3) not null, "description" text not null, "species" text not null, "tags" text[] null);',
    );

    this.addSql(
      'create table "_prisma_migrations" ("id" varchar(36) not null, "checksum" varchar(64) not null, "finished_at" timestamptz(6) null, "migration_name" varchar(255) not null, "logs" text null, "rolled_back_at" timestamptz(6) null, "started_at" timestamptz(6) not null default now(), "applied_steps_count" int4 not null default 0, constraint "_prisma_migrations_pkey" primary key ("id"));',
    );

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "pet" cascade;');

    this.addSql('drop table if exists "pet_tags" cascade;');
  }
}
