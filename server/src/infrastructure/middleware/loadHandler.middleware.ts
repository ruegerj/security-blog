import { RequestHandler } from 'express';
import toobusy from 'toobusy-js';
import { IConfig } from '../config/interfaces';
import { ServiceUnavailableError } from '../errors';
import { ILogger } from '../logger/interfaces';

/**
 * Configures toobusy module for monitoring the event loop, returns middleware for load handling
 * @param config Global configuration instnace
 * @param logger Logger instance
 * @returns Middleware for detecting and handling too heavy load on event loop
 */
export function loadHandler(config: IConfig, logger: ILogger): RequestHandler {
	// Set max lag allowed for event loop
	toobusy.maxLag(config.app.maxLag);

	// Hook up logger on lag event
	toobusy.onLag((lag) => {
		logger.warn(`Event loop lag detected, current latency: ${lag}ms`, lag);
	});

	return (req, res, next) => {
		// No lag spike detected => proceed with request
		if (!toobusy()) {
			return next();
		}

		next(
			new ServiceUnavailableError(
				'Service is busy, therefore request cannot be processed please try again later',
			),
		);
	};
}
