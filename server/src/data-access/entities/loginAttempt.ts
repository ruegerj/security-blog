import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

/**
 * Model for the login attempt entity
 */
@Entity()
export class LoginAttempt {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Timestamp of the attempt
	 */
	@Column('integer')
	timestamp: Date;

	/**
	 * Indicates if the attempt was successful
	 */
	@Column('integer')
	successful: boolean;

	/**
	 * User which issued the login attempt
	 */
	@ManyToOne((type) => User, (user) => user.loginAttemtps)
	user: User;
}
