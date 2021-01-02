import { ChallengeRequestDto, ChallengeVerifyDto } from '@domain/dtos';
import { ChallengeType } from '@domain/dtos/enums';
import { IChallengeService } from '@domain/services/interfaces';
import { BadRequestError } from '@infrastructure/errors';
import { Tokens } from '@infrastructure/ioc';
import { validate } from '@infrastructure/middleware';
import { SuccessResponse } from '@infrastructure/responses';
import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { ControllerBase } from './controller.base';

/**
 * Controller for all challenge (second authentication factor) related opertations
 */
@Service({ id: Tokens.ControllerBase, multiple: true })
export class ChallengeController extends ControllerBase {
	readonly basePath = '/api/challenge';

	constructor(
		@Inject(Tokens.IChallengeService)
		private challengeService: IChallengeService,
	) {
		super();
	}

	/**
	 * Endpoint for requesting a challenge
	 */
	async getChallenge(req: Request, res: Response): Promise<void> {
		const model = req.body as ChallengeRequestDto;

		// Handle request according to challenge type
		switch (model.type) {
			case ChallengeType.SMS:
				const challengeId = await this.challengeService.requestSmsChallenge(
					model,
				);

				res.status(201).json(
					new SuccessResponse()
						.withMessage('SMS token has been sendt')
						.withPayload({
							challengeId,
						}),
				);

				break;

			default:
				throw new BadRequestError(
					`Unsupported challenge type "${model.type}"`,
				);
		}
	}

	/**
	 * Endpoint for verifying challenge tokens
	 */
	async verifyChallenge(req: Request, res: Response): Promise<void> {
		const model = req.body as ChallengeVerifyDto;

		switch (model.type) {
			case ChallengeType.SMS:
				const challengeToken = await this.challengeService.verifySmsChallenge(
					model,
				);

				res.status(200).json(
					new SuccessResponse()
						.withMessage('SMS token successfuly validated')
						.withPayload({
							challengeToken,
						}),
				);

				break;

			default:
				throw new BadRequestError(
					`Unsupported challenge type "${model.type}"`,
				);
		}
	}

	initializeRoutes(): void {
		this.router.post(
			'/get',
			validate(ChallengeRequestDto),
			this.catch(this.getChallenge, this),
		);

		this.router.post(
			'/verify',
			validate(ChallengeVerifyDto),
			this.catch(this.verifyChallenge, this),
		);
	}
}
