import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1772388777360 implements MigrationInterface {
    name = ' $npmConfigName1772388777360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` ADD \`title2\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todo\` DROP COLUMN \`title2\``);
    }

}



