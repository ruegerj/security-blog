import Container from 'typedi';
import {
	AuthenticationService,
	BCryptHashingService,
	ChallengeService,
	JwtService,
	LoginAttemptService,
	SmsService,
} from './services';

/**
 * Configures the domain specific services & dependencies
 */
export async function configure(): Promise<void> {
	// Register service instances
	Container.import([
		AuthenticationService,
		LoginAttemptService,
		BCryptHashingService,
		JwtService,
		ChallengeService,
		SmsService,
	]);
}
