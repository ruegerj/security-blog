import { SignUpDto, TokenResponseDto, LoginDto } from '@domain/dtos';

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
	 * Should validate if the given credentials are valid
	 * @param email Email which should be validated
	 * @param password Plain text password which should be valdiated
	 * @returns Boolean if the credentials are valid
	 */
	validateCredentials(email: string, password: string): Promise<boolean>;

	/**
	 * Should sign up a new user according to the provided data
	 * @param model Dto containing the nescessary data for creating a new user
	 */
	signUp(model: SignUpDto): Promise<void>;
}
