import {
	Column,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { IEntity } from './interfaces';
import { User } from './user';

/**
 * Model for the login attempt entity
 */
@Entity()
export class LoginAttempt implements IEntity {
	@Index({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Timestamp of the attempt
	 */
	@Index()
	@Column('integer')
	timestamp: Date;

	/**
	 * Type of the attempt
	 */
	@Column('integer')
	type: AttemptType;

	/**
	 * Indicates if the attempt was successful
	 */
	@Column('integer')
	successful: boolean;

	/**
	 * User which issued the login attempt
	 */
	@ManyToOne((type) => User, (user) => user.loginAttemtps, {
		onDelete: 'CASCADE',
	})
	user: User;
}

/**
 * Enum which specifies the type of an attempt
 */
export enum AttemptType {
	/**
	 * Login failed => user credentials were invalid
	 */
	Login = 0,

	/**
	 * Challenge verification failed => challenge token was invalid
	 */
	Challenge = 1,
}
