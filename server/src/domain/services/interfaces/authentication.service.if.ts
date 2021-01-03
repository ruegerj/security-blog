import { User } from '@data-access/entities';
import { SignUpDto, TokenResponseDto, LoginDto } from '@domain/dtos';
import { ICredentials } from '@domain/dtos/interfaces';

/**
 * Interface for a service which handles authentication related operations
 */
export interface IAuthenticationService {
	/**
	 * Should validate the given login params and log the user in if they are valid
	 * @param model Dto containing all nescessary login parameters
	 * @returns Dto containing both access- and refresh-token for the user
	 */
	login(model: LoginDto): Promise<TokenResponseDto>;

	/**
	 * Should issue a new access token if the given refresh token is valid
	 * @param refreshToken Refresh token which authenticates the user and is used to issue a new access token
	 * @returns Newly issued access token
	 */
	refreshAccessToken(refreshToken: string): Promise<string>;

	/**
	 * Should logout the user with the given id
	 * @param userId Id of the user which should be logged out
	 */
	logout(userId: string): Promise<void>;

	/**
	 * Should validate the given credentials, if valid the corresponding user entity is returned
	 * @param credentials Email and plain password of the user
	 * @returns User if credentials valid, else null
	 */
	getAuthenticatedUser(credentials: ICredentials): Promise<User>;

	/**
	 * Should check if the max amount of failed login attempts have been exceeded by the given user
	 * @param user User for which the login attempts shall be checked
	 * @returns Boolean if the max attempts have been exceeded
	 */
	loginAttemptsExceeded(user: User): Promise<boolean>;

	/**
	 * Should sign up a new user according to the provided data
	 * @param model Dto containing the nescessary data for creating a new user
	 * @returns Id of the created user
	 */
	signUp(model: SignUpDto): Promise<string>;
}
