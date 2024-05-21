import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserSystem1716253357054 implements MigrationInterface {
  name = 'AddUserSystem1716253357054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email" ("emailId" uuid NOT NULL DEFAULT uuid_generate_v4(), "emailAddress" character varying NOT NULL, "verifyCode" character varying(6) NOT NULL, "verifiedAt" TIMESTAMP, "expiredAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_95ecd9fb34f3dc068132b4c90ad" PRIMARY KEY ("emailId"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "user" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(20) NOT NULL, "emailAddress" character varying NOT NULL, "profileUrl" character varying, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "marketing" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "session" ("sessionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ipAddress" character varying NOT NULL, "token" character varying NOT NULL, "userId" uuid NOT NULL, "accessedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_232f8e85d7633bd6ddfad421696" UNIQUE ("token"), CONSTRAINT "PK_6f8fc3d2111ccc30d98e173d8dd" PRIMARY KEY ("sessionId"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );

    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "email"`);
  }
}
