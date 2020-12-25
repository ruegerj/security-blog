import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { IHashingService } from './interfaces';
import { Service } from 'typedi';
import { Tokens } from '@infrastructure/ioc';

/**
 * BCrypt specific implementation of `IHashingService`
 */
@Service({ id: Tokens.IHashingService })
export class BCryptHashingService implements IHashingService {
	/**
	 * Iteration cost which the bcrypt algo should apply, 12 is equivalent to 4,096 iterations
	 * @link http://security.stackexchange.com/a/83382
	 */
	private iterationCost = 12;

	/**
	 * Creates a new bcrypt hash for the given plain text value
	 * @param value Plain text value which should be hashed
	 * @returns BCrypt hash of given value
	 */
	async create(value: string): Promise<string> {
		// 1. Create SHA-512 hash to ensure a fixed input length for bcrypt
		const sha512Hash = await this.sha512(value);

		// 2. Create salt
		const salt = await bcrypt.genSalt(this.iterationCost);

		// 3. Create bcrypt hash
		return bcrypt.hash(sha512Hash, salt);
	}

	/**
	 * Should verify if the given plaintext value and the given bcrypt hash match
	 * @param value Plain text value which should be verified
	 * @param hash Original bcrypt hash value which acts as verify reference
	 * @returns Boolean if the both values match
	 */
	async verify(value: string, hash: string): Promise<boolean> {
		// 1. Create SHA-512 hash to ensure same hash input
		const sha512Hash = await this.sha512(value);

		// 2. Verify hash
		return bcrypt.compare(sha512Hash, hash);
	}

	/**
	 * Hashes the given value using the SHA-512 algorythm
	 * @param value Value which should be hashed
	 * @returns SHA-512 hash as hex string
	 */
	private sha512(value: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			try {
				const hash = crypto.createHash('sha512');

				const buffer = hash.update(value);

				resolve(buffer.digest('hex'));
			} catch (error) {
				reject(error);
			}
		});
	}
}
