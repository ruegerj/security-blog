import {
	Comment,
	LoginAttempt,
	Post,
	Role,
	SmsToken,
	User,
} from '@data-access/entities';
import {
	CommentRepository,
	LoginAttemptRepository,
	PostRepository,
	RoleRepository,
	SmsTokenRepository,
	UserRepository,
} from '@data-access/repositories';
import {
	ICommentRepository,
	ILoginAttemptRepository,
	IPostRepository,
	IRoleRepository,
	ISmsTokenRepository,
	IUserRepository,
} from '@data-access/repositories/interfaces';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Connection, QueryRunner } from 'typeorm';
import { IUnitOfWork } from './interfaces/uow.if';

/**
 * TypeORM specific implementation of `IUnitOfWork`
 */
export class UnitOfWork implements IUnitOfWork {
	private readonly queryRunner: QueryRunner;

	/**
	 * Flag indicating that this instance was initialized
	 */
	private initialized: boolean;

	/**
	 * Flag indicating if this instance already has been diposed
	 */
	private disposed: boolean;

	constructor(connection: Connection, private logger: ILogger) {
		this.queryRunner = connection.createQueryRunner();
	}

	comments: ICommentRepository;
	loginAttempts: ILoginAttemptRepository;
	posts: IPostRepository;
	roles: IRoleRepository;
	smsTokens: ISmsTokenRepository;
	users: IUserRepository;

	/**
	 * Set's up all managed repositories and starts a transaction
	 * @throws Error if this instance already has been initialized
	 */
	async begin(): Promise<void> {
		if (this.initialized) {
			throw new Error('This unit of work has already been initialized');
		}

		await this.queryRunner.startTransaction();

		const { manager } = this.queryRunner;

		this.comments = new CommentRepository(manager.getRepository(Comment));

		this.loginAttempts = new LoginAttemptRepository(
			manager.getRepository(LoginAttempt),
		);

		this.posts = new PostRepository(manager.getRepository(Post));

		this.roles = new RoleRepository(manager.getRepository(Role));

		this.smsTokens = new SmsTokenRepository(
			manager.getRepository(SmsToken),
		);

		this.users = new UserRepository(manager.getRepository(User));

		this.initialized = true;

		this.logger.debug('UoW instance initialized');
	}

	/**
	 * Commits the underlying transaction and all registered opertations to the db, attempts a rollback if the commit fails
	 * @throws Error if this instance already has been disposed
	 */
	async commit(): Promise<void> {
		if (this.disposed) {
			throw new Error(
				'Cannot commit any work for an unit which is already disposed',
			);
		}

		try {
			await this.queryRunner.commitTransaction();
		} catch (commitError) {
			this.logger.error(
				'Commit for uow failed, attempting rollback',
				commitError,
			);

			await this.rollback();
		} finally {
			await this.dispose();
		}
	}

	/**
	 * Attempts to rollback the perfomed database operations
	 */
	async rollback(): Promise<void> {
		try {
			await this.queryRunner.rollbackTransaction();
		} catch (error) {
			// Catch other errors like lost db connection etc.
			this.logger.error('Rollback of commit failed', error);

			throw error;
		}
	}

	/**
	 * Disposes the managed resources (e.g. the internal `QueryRunner`)
	 */
	dispose(): Promise<void> {
		if (this.disposed) {
			return;
		}

		this.disposed = true;

		return this.queryRunner.release();
	}
}
