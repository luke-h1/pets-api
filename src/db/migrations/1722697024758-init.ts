import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1722697024758 implements MigrationInterface {
    name = 'Init1722697024758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user', 'moderator')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pet_status_enum" AS ENUM('available', 'pending', 'adopted')`);
        await queryRunner.query(`CREATE TABLE "pet" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "type" text NOT NULL, "breed" text NOT NULL, "status" "public"."pet_status_enum" NOT NULL DEFAULT 'available', "birthYear" integer NOT NULL, "photoUrl" text NOT NULL, "creatorId" integer, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON TABLE "pet" IS 'Pets'`);
        await queryRunner.query(`CREATE TABLE "tag_pets_pet" ("tagId" integer NOT NULL, "petId" integer NOT NULL, CONSTRAINT "PK_da53949922ca2b6166e7333ed09" PRIMARY KEY ("tagId", "petId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_88c0fdfc3e4b91b5db60a31002" ON "tag_pets_pet" ("tagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_64abd8e62adde512b5bb43f69c" ON "tag_pets_pet" ("petId") `);
        await queryRunner.query(`CREATE TABLE "pet_tags_tag" ("petId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_262364c525bec26727cfef41bea" PRIMARY KEY ("petId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cafc49ef770a77269022401e87" ON "pet_tags_tag" ("petId") `);
        await queryRunner.query(`CREATE INDEX "IDX_571f34e2d4a1a419a86110eaa0" ON "pet_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_7dee0bba0dcb9f3c5d0052c1466" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_pets_pet" ADD CONSTRAINT "FK_88c0fdfc3e4b91b5db60a310029" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tag_pets_pet" ADD CONSTRAINT "FK_64abd8e62adde512b5bb43f69c1" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pet_tags_tag" ADD CONSTRAINT "FK_cafc49ef770a77269022401e872" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pet_tags_tag" ADD CONSTRAINT "FK_571f34e2d4a1a419a86110eaa0b" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet_tags_tag" DROP CONSTRAINT "FK_571f34e2d4a1a419a86110eaa0b"`);
        await queryRunner.query(`ALTER TABLE "pet_tags_tag" DROP CONSTRAINT "FK_cafc49ef770a77269022401e872"`);
        await queryRunner.query(`ALTER TABLE "tag_pets_pet" DROP CONSTRAINT "FK_64abd8e62adde512b5bb43f69c1"`);
        await queryRunner.query(`ALTER TABLE "tag_pets_pet" DROP CONSTRAINT "FK_88c0fdfc3e4b91b5db60a310029"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_7dee0bba0dcb9f3c5d0052c1466"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_571f34e2d4a1a419a86110eaa0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cafc49ef770a77269022401e87"`);
        await queryRunner.query(`DROP TABLE "pet_tags_tag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64abd8e62adde512b5bb43f69c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88c0fdfc3e4b91b5db60a31002"`);
        await queryRunner.query(`DROP TABLE "tag_pets_pet"`);
        await queryRunner.query(`COMMENT ON TABLE "pet" IS NULL`);
        await queryRunner.query(`DROP TABLE "pet"`);
        await queryRunner.query(`DROP TYPE "public"."pet_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
