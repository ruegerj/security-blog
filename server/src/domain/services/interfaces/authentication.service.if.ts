import { SignUpDto } from '@domain/dtos/signUp.dto';

/**
 * Interface for a service which handles authentication related operations
 */
export interface IAuthenticationService {
	/**
	 * Should sign up a new user according to the provided data
	 * @param model Dto containing the nescessary data for creating a new user
	 */
	signUp(model: SignUpDto): Promise<void>;
}
