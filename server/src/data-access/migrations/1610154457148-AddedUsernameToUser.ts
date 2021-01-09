import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the field `username` to the table `User`
 */

export class AddedUsernameToUser1610154457148 implements MigrationInterface {
	name = 'AddedUsernameToUser1610154457148';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_cace4a159ff9f2512dd4237376"`);
		await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
		await queryRunner.query(`DROP INDEX "IDX_8e1f623798118e629b46a9e629"`);
		await queryRunner.query(
			`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "email" text NOT NULL, "phone" text NOT NULL, "password" text NOT NULL, "tokenVersion" integer NOT NULL, "username" text NOT NULL, CONSTRAINT "UQ_3021ae0235cf9c4a6d59663f859" UNIQUE ("username"))`,
		);
		await queryRunner.query(
			`INSERT INTO "temporary_user"("id", "email", "phone", "password", "tokenVersion") SELECT "id", "email", "phone", "password", "tokenVersion" FROM "user"`,
		);
		await queryRunner.query(`DROP TABLE "user"`);
		await queryRunner.query(
			`ALTER TABLE "temporary_user" RENAME TO "user"`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
		await queryRunner.query(`DROP INDEX "IDX_8e1f623798118e629b46a9e629"`);
		await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
		await queryRunner.query(`DROP INDEX "IDX_cace4a159ff9f2512dd4237376"`);
		await queryRunner.query(
			`ALTER TABLE "user" RENAME TO "temporary_user"`,
		);
		await queryRunner.query(
			`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "email" text NOT NULL, "phone" text NOT NULL, "password" text NOT NULL, "tokenVersion" integer NOT NULL)`,
		);
		await queryRunner.query(
			`INSERT INTO "user"("id", "email", "phone", "password", "tokenVersion") SELECT "id", "email", "phone", "password", "tokenVersion" FROM "temporary_user"`,
		);
		await queryRunner.query(`DROP TABLE "temporary_user"`);
		await queryRunner.query(
			`CREATE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `,
		);
	}
}
