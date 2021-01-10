import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the fields : `createdAt` and `title` to the table `Post`
 */
export class AddedDateAndTitleToPost1610294767374
	implements MigrationInterface {
	name = 'AddedDateAndTitleToPost1610294767374';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_f5b12b405e3ba99533c1dfdbd4"`);
		await queryRunner.query(`DROP INDEX "IDX_be5fda3aac270b134ff9c21cde"`);
		await queryRunner.query(
			`CREATE TABLE "temporary_post" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "status" integer NOT NULL, "authorId" varchar, "title" text NOT NULL, "createdAt" integer NOT NULL, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`,
		);
		await queryRunner.query(
			`INSERT INTO "temporary_post"("id", "content", "status", "authorId") SELECT "id", "content", "status", "authorId" FROM "post"`,
		);
		await queryRunner.query(`DROP TABLE "post"`);
		await queryRunner.query(
			`ALTER TABLE "temporary_post" RENAME TO "post"`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_f5b12b405e3ba99533c1dfdbd4" ON "post" ("status") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_be5fda3aac270b134ff9c21cde" ON "post" ("id") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_be5fda3aac270b134ff9c21cde"`);
		await queryRunner.query(`DROP INDEX "IDX_f5b12b405e3ba99533c1dfdbd4"`);
		await queryRunner.query(
			`ALTER TABLE "post" RENAME TO "temporary_post"`,
		);
		await queryRunner.query(
			`CREATE TABLE "post" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "status" integer NOT NULL, "authorId" varchar, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`,
		);
		await queryRunner.query(
			`INSERT INTO "post"("id", "content", "status", "authorId") SELECT "id", "content", "status", "authorId" FROM "temporary_post"`,
		);
		await queryRunner.query(`DROP TABLE "temporary_post"`);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_be5fda3aac270b134ff9c21cde" ON "post" ("id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_f5b12b405e3ba99533c1dfdbd4" ON "post" ("status") `,
		);
	}
}
