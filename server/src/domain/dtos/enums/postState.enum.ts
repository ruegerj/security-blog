/**
 * Enum which defines the possible states a post can be in
 */
export enum PostState {
	/**
	 * The post is hidden and only visible for the author and admins
	 */
	Hidden = 1,

	/**
	 * The post is published and visible for all users
	 */
	Published = 2,

	/**
	 * The post is deleted and won't be shown on ui
	 */
	Deleted = 3,
}
