/**
 * Enum which defines the possible states a post can be in
 */
export enum PostState {
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
