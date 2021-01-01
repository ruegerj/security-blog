import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { IConfig } from '@infrastructure/config/interfaces';
import { ErrorResponse, FailResponse } from '@infrastructure/responses';
import { HttpError, TooManyRequestsError } from '../errors';
import { ILogger } from '@infrastructure/logger/interfaces';

/**
 * Returns an express error handling middlware
 * @param config Current app config instance
 */
export function errorHandler(
	config: IConfig,
	logger: ILogger,
): ErrorRequestHandler {
	return (
		error: HttpError,
		req: Request,
		res: Response,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		next: NextFunction,
	) => {
		// Convert error to an obj which is serializable
		const errorObj = {
			name: error.name,
			message: error.message,
			stack: error.stack,
			data: error.data,
		};

		logger.error(
			error.isOperational === true
				? 'Caught operational error'
				: 'Caught unhandled error',
			errorObj,
		);

		const statusCode = error.status || 500;

		let responseMessage = 'Somethin went wrong...';
		let payload = undefined;

		// Only show detailed error in response when in development env
		if (config.env.isDevelopment) {
			responseMessage = error.message;
			payload = errorObj;
		} else if (error.isOperational === true) {
			// If operational error use error message & data payload
			responseMessage = error.message;
			payload = error.data;
		}

		// Fail response when code = `4XX` else Error response when code = `5XX`
		const responseObj =
			statusCode < 500 ? new FailResponse() : new ErrorResponse();

		// Handle specific errors individualy
		if (error instanceof TooManyRequestsError) {
			res.setHeader('Retry-After', error.data.retryAfter);
		}

		res.status(statusCode).json(
			responseObj.withMessage(responseMessage).withPayload(payload),
		);
	};
}
