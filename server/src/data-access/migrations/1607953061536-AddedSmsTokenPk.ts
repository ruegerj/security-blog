import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migrates the primary key from the _token_ field and creates the new dedicated pk field _id_
 */
export class AddedSmsTokenPk1607953061536 implements MigrationInterface {
	name = 'AddedSmsTokenPk1607953061536';

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
