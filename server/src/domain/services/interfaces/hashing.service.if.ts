/**
 * Interface for a service which is responsible for creating and verifying hashes
 */
export interface IHashingService {
	/**
	 * Should create a new hash for the given plain text value
	 * @param value Plain text value which should be hashed
	 * @returns Hash of given value
	 */
	create(value: string): Promise<string>;

	/**
	 * Should verify if the given plaintext value and the given hash match
	 * @param value Plain text value which should be verified
	 * @param hash Original hash value which acts as verify reference
	 * @returns Boolean if the both values match
	 */
	verify(value: string, hash: string): Promise<boolean>;
}
