import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the _tokenVersion_ field or drops it
 */
export class AddedTokenVersionToUser1608539293344
	implements MigrationInterface {
	name = 'AddedTokenVersionToUser1608539293344';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_c418809d8c85e0e2c666482f5a"`);
		await queryRunner.query(
			`CREATE TABLE "temporary_sms_token" ("token" text NOT NULL, "issuedAt" integer NOT NULL, "redeemed" integer NOT NULL, "userId" varchar, "id" varchar NOT NULL, CONSTRAINT "FK_3837076a666174406a765ce539e" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("token", "id"))`,
		);
		await queryRunner.query(
			`INSERT INTO "temporary_sms_token"("token", "issuedAt", "redeemed", "userId") SELECT "token", "issuedAt", "redeemed", "userId" FROM "sms_token"`,
		);
		await queryRunner.query(`DROP TABLE "sms_token"`);
		await queryRunner.query(
			`ALTER TABLE "temporary_sms_token" RENAME TO "sms_token"`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_c418809d8c85e0e2c666482f5a" ON "sms_token" ("token") `,
		);
		await queryRunner.query(`DROP INDEX "IDX_8e1f623798118e629b46a9e629"`);
		await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
		await queryRunner.query(`DROP INDEX "IDX_cace4a159ff9f2512dd4237376"`);
		await queryRunner.query(
			`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "email" text NOT NULL, "phone" text NOT NULL, "password" text NOT NULL, "tokenVersion" integer NOT NULL)`,
		);
		await queryRunner.query(
			`INSERT INTO "temporary_user"("id", "email", "phone", "password") SELECT "id", "email", "phone", "password" FROM "user"`,
		);
		await queryRunner.query(`DROP TABLE "user"`);
		await queryRunner.query(
			`ALTER TABLE "temporary_user" RENAME TO "user"`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `,
		);
		await queryRunner.query(`DROP INDEX "IDX_c418809d8c85e0e2c666482f5a"`);
		await queryRunner.query(
			`CREATE TABLE "temporary_sms_token" ("token" text NOT NULL, "issuedAt" integer NOT NULL, "redeemed" integer NOT NULL, "userId" varchar, "id" varchar PRIMARY KEY NOT NULL, CONSTRAINT "FK_3837076a666174406a765ce539e" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
		);
		await queryRunner.query(
			`INSERT INTO "temporary_sms_token"("token", "issuedAt", "redeemed", "userId", "id") SELECT "token", "issuedAt", "redeemed", "userId", "id" FROM "sms_token"`,
		);
		await queryRunner.query(`DROP TABLE "sms_token"`);
		await queryRunner.query(
			`ALTER TABLE "temporary_sms_token" RENAME TO "sms_token"`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_c418809d8c85e0e2c666482f5a" ON "sms_token" ("token") `,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_d57ca0d395e42b671cc011c06f" ON "sms_token" ("id") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "IDX_d57ca0d395e42b671cc011c06f"`);
		await queryRunner.query(`DROP INDEX "IDX_c418809d8c85e0e2c666482f5a"`);
		await queryRunner.query(
			`ALTER TABLE "sms_token" RENAME TO "temporary_sms_token"`,
		);
		await queryRunner.query(
			`CREATE TABLE "sms_token" ("token" text NOT NULL, "issuedAt" integer NOT NULL, "redeemed" integer NOT NULL, "userId" varchar, "id" varchar NOT NULL, CONSTRAINT "FK_3837076a666174406a765ce539e" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("token", "id"))`,
		);
		await queryRunner.query(
			`INSERT INTO "sms_token"("token", "issuedAt", "redeemed", "userId", "id") SELECT "token", "issuedAt", "redeemed", "userId", "id" FROM "temporary_sms_token"`,
		);
		await queryRunner.query(`DROP TABLE "temporary_sms_token"`);
		await queryRunner.query(
			`CREATE INDEX "IDX_c418809d8c85e0e2c666482f5a" ON "sms_token" ("token") `,
		);
		await queryRunner.query(`DROP INDEX "IDX_cace4a159ff9f2512dd4237376"`);
		await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
		await queryRunner.query(`DROP INDEX "IDX_8e1f623798118e629b46a9e629"`);
		await queryRunner.query(
			`ALTER TABLE "user" RENAME TO "temporary_user"`,
		);
		await queryRunner.query(
			`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "email" text NOT NULL, "phone" text NOT NULL, "password" text NOT NULL)`,
		);
		await queryRunner.query(
			`INSERT INTO "user"("id", "email", "phone", "password") SELECT "id", "email", "phone", "password" FROM "temporary_user"`,
		);
		await queryRunner.query(`DROP TABLE "temporary_user"`);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `,
		);
		await queryRunner.query(`DROP INDEX "IDX_c418809d8c85e0e2c666482f5a"`);
		await queryRunner.query(
			`ALTER TABLE "sms_token" RENAME TO "temporary_sms_token"`,
		);
		await queryRunner.query(
			`CREATE TABLE "sms_token" ("token" text PRIMARY KEY NOT NULL, "issuedAt" integer NOT NULL, "redeemed" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_3837076a666174406a765ce539e" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
		);
		await queryRunner.query(
			`INSERT INTO "sms_token"("token", "issuedAt", "redeemed", "userId") SELECT "token", "issuedAt", "redeemed", "userId" FROM "temporary_sms_token"`,
		);
		await queryRunner.query(`DROP TABLE "temporary_sms_token"`);
		await queryRunner.query(
			`CREATE INDEX "IDX_c418809d8c85e0e2c666482f5a" ON "sms_token" ("token") `,
		);
	}
}
