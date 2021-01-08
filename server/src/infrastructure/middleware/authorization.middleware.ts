import { Role } from '@domain/dtos/enums/role.enum';
import { ForbiddenError } from '@infrastructure/errors';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { IAuthenticatedUserLocals } from './authenticate.middleware';

/**
 * Returns a middleware which checks if the current user has one of the provided roles
 * Note: MUST be applied after the `authenticate()` middleware, else an the request always result in a forbidden response
 * @param roles Collection of roles which are allowed for the applied route
 */
export function authorize(...roles: Role[]): RequestHandler {
	if (roles.length == 0) {
		throw new Error('Atleast one role must be provided');
	}

	return (req: Request, res: Response, next: NextFunction) => {
		const { user } = res.locals as IAuthenticatedUserLocals;

		if (!user) {
			return next(
				new ForbiddenError(
					'Operation prohibited, due to the lack of permissions',
				),
			);
		}

		// Check if the current user has atleast one of the required roles
		const isInAnyRole = user.roles.some((r) => roles.includes(r as Role));

		if (!isInAnyRole) {
			return next(
				new ForbiddenError(
					'Operation prohibited, due to the lack of permissions',
				),
			);
		}

		next();
	};
}
