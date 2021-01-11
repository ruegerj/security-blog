import { Pipe, PipeTransform } from '@angular/core';

// Credits

/**
 * Pipe for unescaping html strings
 */
@Pipe({
	name: 'unescape',
})
export class UnescapePipe implements PipeTransform {
	transform(value: string, ...args: unknown[]): string | null {
		const doc = new DOMParser().parseFromString(value, 'text/html');
		return doc.documentElement.textContent;
	}
}
