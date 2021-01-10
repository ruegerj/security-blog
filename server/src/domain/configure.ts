import Container from 'typedi';
import {
	AuthenticationService,
	BCryptHashingService,
	ChallengeService,
	JwtService,
	LoginAttemptService,
	SmsService,
} from './services';
import { PostService } from './services/post.service';

/**
 * Configures the domain specific services & dependencies
 */
export async function configure(): Promise<void> {
	// Register service instances
	Container.import([
		AuthenticationService,
		LoginAttemptService,
		PostService,
		BCryptHashingService,
		JwtService,
		ChallengeService,
		SmsService,
	]);
}
