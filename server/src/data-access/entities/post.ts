import {
	Column,
	Entity,
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
	@Column('integer')
	status: number;

	/**
	 * Author of this post
	 */
	@ManyToOne((type) => User, (user) => user.posts)
	@JoinColumn()
	author: User;

	/**
	 * Collection of all comments for this post
	 */
	@OneToMany((type) => Comment, (comment) => comment.post)
	@JoinColumn()
	comments: Comment[];
}
