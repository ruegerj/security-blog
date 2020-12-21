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
 * Entity representation of a sms token which can be issued to an user
 */
@Entity()
export class SmsToken implements IEntity {
	@Index({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Token which was issued
	 */
	@Index()
	@Column('text')
	token: string;

	/**
	 * Issued at timestamp
	 */
	@Column('integer')
	issuedAt: Date;

	/**
	 * Was the token ever redeemed by the user
	 */
	@Column('integer')
	redeemed: boolean;

	/**
	 * User which this token is assigned to
	 */
	@ManyToOne((type) => User, (user) => user.tokens, {
		onDelete: 'CASCADE',
	})
	user: User;
}
