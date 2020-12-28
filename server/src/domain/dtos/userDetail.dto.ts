import { RoleDto } from './role.dto';

/**
 * Dto containing all user information including its roles
 */
export class UserDetailDto {
	id: string;
	email: string;
	phone: string;
	tokenVersion: number;

	/**
	 * All roles assigned to this user
	 */
	roles: RoleDto[];
}
