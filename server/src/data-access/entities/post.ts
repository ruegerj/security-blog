import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment';
import { IEntity } from './interfaces';
import { User } from './user';

/**
 * Model for the post entity
 */
@Entity()
export class Post implements IEntity {
	@Index({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Title of the post
	 */
	@Column('text')
	title: string;

	/**
	 * Timestamp when the post was created
	 */
	@Column('integer')
	createdAt: Date;

	/**
	 * Content / Text of the post
	 */
	@Column('text')
	content: string;

	/**
	 * Status of this post (index of enum)
	 */
	@Index()
	@Column('integer')
	status: PostState;

	/**
	 * Author of this post
	 */
	@ManyToOne((type) => User, (user) => user.posts, {
		onDelete: 'RESTRICT',
	})
	@JoinColumn()
	author: User;

	/**
	 * Collection of all comments for this post
	 */
	@OneToMany((type) => Comment, (comment) => comment.post)
	@JoinColumn()
	comments: Comment[];
}

/**
 * Defines all possible states a post can have
 */
export enum PostState {
	/**
	 * The post is published and visible for all users
	 */
	Published = 1,

	/**
	 * The post is hidden and only visible for the author and admins
	 */
	Hidden = 2,

	/**
	 * The post is deleted and won't be shown on ui
	 */
	Deleted = 3,
}
