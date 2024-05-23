import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEmailToMagiclink1716446666432 implements MigrationInterface {
  name = 'ChangeEmailToMagiclink1716446666432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "emailAddress" TO "email"`,
    );

    await queryRunner.query(
      `CREATE TABLE "magiclink" ("magiclinkId" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "verifyCode" character varying(6) NOT NULL, "verifiedAt" TIMESTAMP, "expiredAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_53b021316867266869ee18a8f70" PRIMARY KEY ("magiclinkId"))`,
    );

    await queryRunner.query(`DROP TABLE "email"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "magiclink"`);
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "email" TO "emailAddress"`,
    );

    await queryRunner.query(
      `CREATE TABLE "email" ("emailId" uuid NOT NULL DEFAULT uuid_generate_v4(), "emailAddress" character varying NOT NULL, "verifyCode" character varying(6) NOT NULL, "verifiedAt" TIMESTAMP, "expiredAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_95ecd9fb34f3dc068132b4c90ad" PRIMARY KEY ("emailId"))`,
    );
  }
}
