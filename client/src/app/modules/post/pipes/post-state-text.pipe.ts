import { Pipe, PipeTransform } from '@angular/core';
import { PostState } from '@data/enums';

/**
 * Pipe for transforming a `PostState` to its according text
 */
@Pipe({
	name: 'postStateText',
})
export class PostStateTextPipe implements PipeTransform {
	transform(value: PostState, ...args: unknown[]): string {
		switch (value) {
			case PostState.Published:
				return 'Published';

			case PostState.Hidden:
				return 'Hidden';

			case PostState.Deleted:
				return 'Deleted';

			default:
				return '';
		}
	}
}
