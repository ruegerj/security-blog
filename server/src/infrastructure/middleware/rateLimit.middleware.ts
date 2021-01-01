import { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { FailResponse } from '@infrastructure/responses';
import { HttpStatusCode } from '@infrastructure/httpStatusCodes';
import { TooManyRequestsPayload } from '@infrastructure/errors';

/**
 * Returns a middleware which limits the amount of requests accepted from a single client on a specific express route stack
 * @param timeWindow Number of miliseconds which specify the window in which the requests are counted
 * @param maxRequests Max number of requests a single client is allowed to send to the applied route
 */
export function limit(timeWindow: number, maxRequests: number): RequestHandler {
	const windowSeconds = timeWindow / 1000;
	const windowMinutes = windowSeconds / 60;

	const rateLimitFailResponse = new FailResponse<TooManyRequestsPayload>()
		.withMessage(
			`There were too many request from your IP, please try again in ${windowMinutes} minutes`,
		)
		.withPayload({
			retryAfter: windowSeconds,
		});

	return rateLimit({
		max: maxRequests,
		windowMs: timeWindow,
		handler: (req, res) => {
			res.status(HttpStatusCode.TooManyRequests).json(
				rateLimitFailResponse,
			);
		},
	});
}
