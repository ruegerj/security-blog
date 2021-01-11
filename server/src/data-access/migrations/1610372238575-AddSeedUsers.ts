import { Role, User } from '@data-access/entities';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the default user accounts to the database
 */
export class AddSeedUsers1610372238575 implements MigrationInterface {
	private readonly adminId = '0185284f-125f-4c30-928b-00ae90345979';
	private readonly userId = 'a346741f-09f1-4071-a02d-31978b3b15d3';

	// Taken from role seed migration
	private readonly adminRoleId = 'ec87ed12-74cc-4cd6-81af-eb65d8b864c2';
	private readonly userRoleId = 'a2e76173-ea0b-4082-9c0f-614b4ccc6faa';

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create admin user
		const admin = new User();
		admin.id = this.adminId;
		admin.username = 'not-the-admin';
		admin.email = 'admin@security-blog.io';
		admin.password =
			'$2b$12$BDRijxzWY.n7qDAxKtP2puCqLi7N3ze7B5Xl4kX8BAu9eEe6eNMui'; // ImTh34dm|n
		admin.phone = '123456789'; // Mock phone nr
		admin.tokenVersion = -1;

		// Assign admin role
		const adminRole = await queryRunner.manager.findOneOrFail(
			Role,
			this.adminRoleId,
		);
		admin.roles = [adminRole];

		await queryRunner.manager.save(User, admin);

		// Create standard user
		const user = new User();
		user.id = this.userId;
		user.username = 'john.doe';
		user.email = 'john.doe@security-blog.io';
		user.password =
			'$2b$12$xPwGh9SUj4ApPgVcCWiYRewGDQ1PMsI9BSDUbrBVySlMkjedlVjcu'; // BlogP4$$w0rd
		user.phone = '987654321'; // Mock phone nr
		user.tokenVersion = -1;

		const userRole = await queryRunner.manager.findOneOrFail(
			Role,
			this.userRoleId,
		);

		user.roles = [userRole];

		await queryRunner.manager.save(User, user);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Delete admin user
		const admin = await queryRunner.manager.findOneOrFail(
			User,
			this.adminId,
		);

		// Remove role mapping
		admin.roles = [];
		await queryRunner.manager.save(User, admin);

		await queryRunner.manager.remove(admin);

		// Delete standard user
		const user = await queryRunner.manager.findOneOrFail(User, this.userId);

		// Remove role mapping
		user.roles = [];
		await queryRunner.manager.save(User, user);

		await queryRunner.manager.remove(user);
	}
}
