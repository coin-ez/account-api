import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTrxWallet1717220352802 implements MigrationInterface {
    name = 'AddUserTrxWallet1717220352802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "tronAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tronAddress"`);
    }

}
