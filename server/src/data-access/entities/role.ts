import {
	Column,
	Entity,
	Index,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { IEntity } from './interfaces';
import { User } from './user';

/**
 * Model for the role entity
 */
@Entity()
export class Role implements IEntity {
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
	@ManyToMany((type) => User, (user) => user.roles, {
		onDelete: 'RESTRICT',
	})
	users: User[];
}
