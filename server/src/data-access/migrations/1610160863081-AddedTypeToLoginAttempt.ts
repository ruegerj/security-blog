import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the `type` field to the `LoginAttempt` table
 */
export class AddedTypeToLoginAttempt1610160863081
	implements MigrationInterface {
	name = 'AddedTypeToLoginAttempt1610160863081';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_0f39a5f0d8be9cf362f839764c"`);
		await queryRunner.query(`DROP INDEX "IDX_72829cd4f7424e3cdfd46c476c"`);
		await queryRunner.query(
			`CREATE TABLE "temporary_login_attempt" ("id" varchar PRIMARY KEY NOT NULL, "timestamp" integer NOT NULL, "successful" integer NOT NULL, "userId" varchar, "type" integer NOT NULL, CONSTRAINT "FK_dcca053abaa3e4b753b980a97fc" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
		);
		await queryRunner.query(
			`INSERT INTO "temporary_login_attempt"("id", "timestamp", "successful", "userId") SELECT "id", "timestamp", "successful", "userId" FROM "login_attempt"`,
		);
		await queryRunner.query(`DROP TABLE "login_attempt"`);
		await queryRunner.query(
			`ALTER TABLE "temporary_login_attempt" RENAME TO "login_attempt"`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_0f39a5f0d8be9cf362f839764c" ON "login_attempt" ("timestamp") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_72829cd4f7424e3cdfd46c476c" ON "login_attempt" ("id") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_72829cd4f7424e3cdfd46c476c"`);
		await queryRunner.query(`DROP INDEX "IDX_0f39a5f0d8be9cf362f839764c"`);
		await queryRunner.query(
			`ALTER TABLE "login_attempt" RENAME TO "temporary_login_attempt"`,
		);
		await queryRunner.query(
			`CREATE TABLE "login_attempt" ("id" varchar PRIMARY KEY NOT NULL, "timestamp" integer NOT NULL, "successful" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_dcca053abaa3e4b753b980a97fc" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
		);
		await queryRunner.query(
			`INSERT INTO "login_attempt"("id", "timestamp", "successful", "userId") SELECT "id", "timestamp", "successful", "userId" FROM "temporary_login_attempt"`,
		);
		await queryRunner.query(`DROP TABLE "temporary_login_attempt"`);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_72829cd4f7424e3cdfd46c476c" ON "login_attempt" ("id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_0f39a5f0d8be9cf362f839764c" ON "login_attempt" ("timestamp") `,
		);
	}
}
