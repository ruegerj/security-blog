import { Role } from '@data-access/entities';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Seed-Migrations which creates the expected roles or deletes them
 */
export class AddRoleSeed1610117232286 implements MigrationInterface {
	private readonly adminRoleId = 'ec87ed12-74cc-4cd6-81af-eb65d8b864c2';
	private readonly userRoleId = 'a2e76173-ea0b-4082-9c0f-614b4ccc6faa';

	public async up(queryRunner: QueryRunner): Promise<void> {
		const adminRole = new Role();
		adminRole.id = this.adminRoleId;
		adminRole.name = 'admin';

		const userRole = new Role();
		userRole.id = this.userRoleId;
		userRole.name = 'user';

		await queryRunner.manager.insert(Role, adminRole);
		await queryRunner.manager.insert(Role, userRole);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const adminRole = await queryRunner.manager.findOne(
			Role,
			this.adminRoleId,
		);

		const userRole = await queryRunner.manager.findOne(
			Role,
			this.userRoleId,
		);

		if (adminRole) {
			await queryRunner.manager.remove(adminRole);
		}

		if (userRole) {
			await queryRunner.manager.remove(userRole);
		}
	}
}
