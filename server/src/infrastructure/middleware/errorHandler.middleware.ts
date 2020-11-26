import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';

export function errorHandler(
	error: HttpError,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const statusCode = error.status || 500;

	const message = 'Something went wrong...'; // Generic error message as default
	const payload: any = null;
}
