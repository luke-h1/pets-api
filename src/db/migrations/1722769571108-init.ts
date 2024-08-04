import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1722769571108 implements MigrationInterface {
  name = 'Init1722769571108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "petsId" uuid, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user', 'moderator')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."pet_status_enum" AS ENUM('available', 'pending', 'adopted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "pet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "type" text NOT NULL, "breed" text NOT NULL, "status" "public"."pet_status_enum" NOT NULL DEFAULT 'available', "birthYear" integer NOT NULL, "photoUrl" text NOT NULL, "creatorId" uuid, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`COMMENT ON TABLE "pet" IS 'Pets'`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "FK_fd9bf55bf9e4b0ab683a0d84e05" FOREIGN KEY ("petsId") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_7dee0bba0dcb9f3c5d0052c1466" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_7dee0bba0dcb9f3c5d0052c1466"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "FK_fd9bf55bf9e4b0ab683a0d84e05"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "pet" IS NULL`);
    await queryRunner.query(`DROP TABLE "pet"`);
    await queryRunner.query(`DROP TYPE "public"."pet_status_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
