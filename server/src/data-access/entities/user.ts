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
import { LoginAttempt } from './loginAttempt';
import { Post } from './post';
import { Role } from './role';
import { SmsToken } from './smsToken';

/**
 * Model for the user entity
 */
@Entity()
export class User {
	@Index({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Email of the user
	 */
	@Index()
	@Column('text')
	email: string;

	/**
	 * Phone number of the user
	 */
	@Index()
	@Column('text')
	phone: string;

	/**
	 * Password hash of the user
	 */
	@Column('text')
	password: string;

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
	@ManyToMany((type) => Role, (role) => role.id, {
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
