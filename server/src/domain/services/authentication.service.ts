import { User } from '@data-access/entities';
import { IUnitOfWorkFactory } from '@data-access/uow/factory/interfaces';
import { SignUpDto } from '@domain/dtos/signUp.dto';
import { ValidationFailedError } from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { ILogger } from '@infrastructure/logger/interfaces';
import { Inject, Service } from 'typedi';
import { IAuthenticationService, IHashingService } from './interfaces';

/**
 * Explicit implementation of `IAuthenticationService`
 */
@Service({ id: Tokens.IAuthenticationService })
export class AuthenticationService implements IAuthenticationService {
	constructor(
		@Inject(Tokens.IUnitOfWorkFactory)
		private uowFactory: IUnitOfWorkFactory,
		@Inject(Tokens.IHashingService)
		private hashingService: IHashingService,
		@Inject(Tokens.ILogger)
		private logger: ILogger,
	) {}

	/**
	 * Signs up a new user according to the provided data
	 * @param model Dto containing the nescessary data for creating a new user
	 * @returns Id of the created user
	 */
	async signUp(model: SignUpDto): Promise<string> {
		const signUpUser = this.uowFactory.create();

		await signUpUser.begin();

		// If email already in use => return validation error
		const emailExists = await signUpUser.users.emailExists(model.email);

		if (emailExists) {
			signUpUser.rollback(); // dispose uow

			throw new ValidationFailedError({
				errors: {
					email: ['The email is already in use'],
				},
			});
		}

		// If phone nr already in use => return validation error
		const phoneExists = await signUpUser.users.phoneExists(model.phone);

		if (phoneExists) {
			signUpUser.rollback(); // Dispose uow

			throw new ValidationFailedError({
				errors: {
					phone: ['The phone number is already in use'],
				},
			});
		}

		// Everything is fine => create actual user
		const passwordHash = await this.hashingService.create(model.password);

		// Trim "0" prefix if exists on phone nr
		if (model.phone.startsWith('0')) {
			model.phone = model.phone.substr(1, model.phone.length);
		}

		const user = new User();
		user.email = model.email;
		user.password = passwordHash;
		user.phone = model.phone;
		user.tokenVersion = -1; // user hasn't logged in yet => -1

		await signUpUser.users.add(user);

		await signUpUser.commit();

		this.logger.info(`Created user "${user.email}"`);

		return user.id;
	}
}
