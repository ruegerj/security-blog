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
import { User } from './user';

/**
 * Model for the post entity
 */
@Entity()
export class Post {
	@Index({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

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
	status: PostType;

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
export enum PostType {
	/**
	 * The post is published and visible for all users
	 */
	Published,

	/**
	 * The post is hidden and only visible for the author and admins
	 */
	Hidden,

	/**
	 * The post is deleted and won't be shown on ui
	 */
	Deleted,
}
