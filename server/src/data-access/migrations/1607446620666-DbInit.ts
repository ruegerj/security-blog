import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates or drops the database
 */
export class DbInit1607446620666 implements MigrationInterface {
	private readonly dbName = 'security-blog';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createDatabase(this.dbName);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropDatabase(this.dbName);
	}
}
