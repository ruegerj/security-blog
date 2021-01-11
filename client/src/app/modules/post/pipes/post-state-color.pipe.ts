import { Pipe, PipeTransform } from '@angular/core';
import { PostState } from '@data/enums';

/**
 * Pipe for transforming an `PostState` to its according color
 */
@Pipe({
	name: 'postStateColor',
})
export class PostStateColorPipe implements PipeTransform {
	transform(value: PostState, ...args: unknown[]): string {
		switch (value) {
			case PostState.Published:
				return 'green';

			case PostState.Hidden:
				return 'grey darken-1';

			case PostState.Deleted:
				return 'red';

			default:
				return '';
		}
	}
}
