import { NextFunction, Request, Response, RequestHandler } from 'express';

/**
 * Returns a middleware which automatically redirects http request to https
 */
export function httpsRedirect(): RequestHandler {
	return (req: Request, res: Response, next: NextFunction) => {
		// Request is http => redirect to https
		if (!req.secure) {
			return res.redirect(301, `https://${req.headers.host}${req.url}`);
		}

		next();
	};
}
