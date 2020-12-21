import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { IEntity } from './interfaces';
import { Post } from './post';
import { User } from './user';

@Entity()
export class Comment implements IEntity {
	@Index({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Timestamp when this comment was written
	 */
	@Column('integer')
	timestamp: Date;

	/**
	 * Message of this comment
	 */
	@Column('text')
	message: string;

	/**
	 * Author which wrote this comment
	 */
	@ManyToOne((type) => User, (user) => user.comments)
	@JoinColumn()
	author: User;

	/**
	 * Post which this comment is attached to
	 */
	@ManyToOne((type) => Post, (post) => post.comments, {
		onDelete: 'CASCADE',
	})
	post: Post;
}
