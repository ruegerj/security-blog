import {
	Column,
	Entity,
	Index,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';

/**
 * Model for the role entity
 */
@Entity()
export class Role {
	@Index({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Name of the role
	 */
	@Column('text')
	name: string;

	/**
	 * Collection of all roles which are assigned to this role
	 */
	@ManyToMany((type) => User, (user) => user.id, {
		onDelete: 'RESTRICT',
	})
	users: User[];
}
