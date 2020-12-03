import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user';

/**
 * Entity representation of a sms token which can be issued to an user
 */
@Entity()
export class SmsToken {
	/**
	 * Token which was issued, serves also as primary key
	 */
	@PrimaryColumn('text')
	token: string;

	/**
	 * Issued at timestamp
	 */
	@Column('integer')
	issuedAt: Date;

	/**
	 * User which this token is assigned to
	 */
	@ManyToOne((type) => User, (user) => user.tokens)
	user: User;
}
