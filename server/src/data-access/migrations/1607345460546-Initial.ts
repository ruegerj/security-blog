import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class Initial1607345460546 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create db
		await queryRunner.createDatabase('security-blog', true);

		// Create user table
		const userTable = new Table({
			name: 'user',
			columns: [
				{
					isPrimary: true,
					isNullable: false,
					isUnique: true,
					name: 'id',
					type: 'text',
				},
				{
					isNullable: false,
					isUnique: true,
					name: 'email',
					type: 'text',
				},
				{
					isNullable: false,
					isUnique: true,
					name: 'phone',
					type: 'text',
				},
				{
					isNullable: false,
					name: 'password',
					type: 'text',
				},
			],
		});

		await queryRunner.createTable(userTable, true);

		// Create post table
		const postTable = new Table({
			name: 'post',
			columns: [
				{
					isPrimary: true,
					isNullable: false,
					isUnique: true,
					name: 'id',
					type: 'text',
				},
				{
					isNullable: false,
					name: 'authorId',
					type: 'text',
				},
				{
					isNullable: false,
					name: 'content',
					type: 'text',
				},
				{
					isNullable: false,
					name: 'status',
					type: 'integer',
				},
			],
		});

		postTable.addForeignKey(
			new TableForeignKey({
				name: 'fk_post_user',
				columnNames: ['authorId'],
				referencedTableName: 'user',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
			}),
		);

		await queryRunner.createTable(postTable, true, true);

		// Create comment table
		const commentTable = new Table({
			name: 'comment',
			columns: [
				{
					isPrimary: true,
					isUnique: true,
					isNullable: false,
					name: 'id',
					type: 'text',
				},
				{
					isNullable: false,
					name: 'authorId',
					type: 'text',
				},
				{
					isNullable: false,
					name: 'postId',
					type: 'text',
				},
				{
					isNullable: false,
					name: 'timestamp',
					type: 'integer',
				},
				{
					isNullable: false,
					name: 'message',
					type: 'text',
				},
			],
		});

		// Add author constraint
		commentTable.addForeignKey(
			new TableForeignKey({
				name: 'fk_comment_user',
				columnNames: ['authorId'],
				referencedTableName: 'user',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
			}),
		);

		// Add post contraint
		commentTable.addForeignKey(
			new TableForeignKey({
				name: 'fk_comment_post',
				columnNames: ['postId'],
				referencedTableName: 'post',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
			}),
		);

		await queryRunner.createTable(commentTable, true, true);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop post table
		await queryRunner.dropForeignKey('post', 'fk_post_user');
		await queryRunner.dropTable('post', true);

		// Drop user table
		await queryRunner.dropTable('user', true);

		// Drop db
		await queryRunner.dropDatabase('security-blog', true);
	}
}
