import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1772299454130 implements MigrationInterface {
    name = ' $npmConfigName1772299454130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` ADD \`description\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`description\``);
    }

}
