import { Router } from 'express';

export abstract class ControllerBase {
	readonly router: Router;
	abstract readonly basePath: string;

	constructor() {
		this.router = Router();
	}
}
