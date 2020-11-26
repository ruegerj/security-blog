import {
	NextFunction,
	Request,
	RequestHandler,
	Response,
	Router,
} from 'express';
import { injectable } from 'inversify';

/**
 * Base class for any controller implementation
 */
@injectable()
export abstract class ControllerBase {
	readonly router = Router();

	/**
	 * Relative base path for the local routes
	 */
	abstract readonly basePath: string;

	constructor() {
		this.initializeRoutes();
	}

	/**
	 * Implementation should hook up all routes with the corresponding handler using the local router
	 */
	protected abstract initializeRoutes(): void;

	/**
	 * Wraps the provided handler in a new function which catches and delegate all caught async errors to the global error handler
	 * @param handler Async handler function whose errors should be caught
	 * @param scope Derived controller class which acts as the scope which the wrapped handler is called with (this arg)
	 */
	protected catch(
		handler: (
			req: Request,
			res: Response,
			next: NextFunction,
		) => Promise<any>,
		scope: ControllerBase,
	): RequestHandler {
		return (req: Request, res: Response, next: NextFunction) => {
			handler.call(scope, req, res, next).catch(next);
		};
	}
}
