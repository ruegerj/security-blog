import {
	Column,
	Entity,
	Index,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment';
import { IEntity } from './interfaces';
import { LoginAttempt } from './loginAttempt';
import { Post } from './post';
import { Role } from './role';
import { SmsToken } from './smsToken';

/**
 * Model for the user entity
 */
@Entity()
export class User implements IEntity {
	@Index({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Username of the user
	 */
	@Index({ unique: true })
	@Column('text', {
		unique: true,
	})
	username: string;

	/**
	 * Email of the user
	 */
	@Index({ unique: true })
	@Column('text', {
		unique: true,
	})
	email: string;

	/**
	 * Phone number of the user
	 */
	@Index({ unique: true })
	@Column('text', {
		unique: true,
	})
	phone: string;

	/**
	 * Password hash of the user
	 */
	@Column('text')
	password: string;

	/**
	 * Current version of the refresh token (indicating the number of login/logout operations performed)
	 */
	@Column('integer')
	tokenVersion: number;

	/**
	 * Collection of all posts written by this user
	 */
	@OneToMany((type) => Post, (post) => post.author)
	posts: Post[];

	/**
	 * All comments which this user has posted
	 */
	@OneToMany((type) => Comment, (comment) => comment.author)
	comments: Comment;

	/**
	 * Collection of all roles which are assigned to this user
	 */
	@ManyToMany((type) => Role, (role) => role.users, {
		onDelete: 'RESTRICT',
	})
	@JoinTable()
	roles: Role[];

	/**
	 * Collection of all sms tokens issued to this usser
	 */
	@OneToMany((type) => SmsToken, (token) => token.user)
	@JoinColumn()
	tokens: SmsToken[];

	/**
	 * Collection of all login attempts of this user
	 */
	@OneToMany((type) => LoginAttempt, (attempt) => attempt.user)
	@JoinColumn()
	loginAttemtps: LoginAttempt[];
}
