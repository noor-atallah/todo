import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1772299062169 implements MigrationInterface {
    name = ' $npmConfigName1772299062169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`title2\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` ADD \`title2\` varchar(255) NOT NULL`);
    }

}
