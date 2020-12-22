import {
	ICommentRepository,
	ILoginAttemptRepository,
	IPostRepository,
	IRoleRepository,
	ISmsTokenRepository,
	IUserRepository,
} from '@data-access/repositories/interfaces';

/**
 * Interface for any Unit of Work implementations
 */
export interface IUnitOfWork {
	comments: ICommentRepository;

	loginAttempts: ILoginAttemptRepository;

	posts: IPostRepository;

	roles: IRoleRepository;

	smsTokens: ISmsTokenRepository;

	users: IUserRepository;

	/**
	 * Should initialize the uow instance for incoming work
	 */
	begin(): Promise<void>;

	/**
	 * Should commit all work done within this unit of work, if the commit fails an automatic rollback shall be attempted
	 */
	commit(): Promise<void>;

	/**
	 * Should attempt a rollback of the performed operations
	 */
	rollback(): Promise<void>;
}
